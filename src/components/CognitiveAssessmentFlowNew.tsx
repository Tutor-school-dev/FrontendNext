"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Brain, CheckCircle, ArrowRight } from 'lucide-react';
import { useCognitiveAssessment, AssessmentPayload, AssessmentResponse } from '../hooks/useCognitiveAssessment';
import {
  ConservationTrackingState,
  ClassificationTrackingState, 
  SeriationTrackingState,
  BaseTrackingState,
  calculateRTBand,
  calculateHBand,
  calculateACBand,
  calculateSBand,
  calculateMBand,
  calculateTPBand,
  calculateTBand,
  calculateCorrBand,
  calculateIdleBand,
  detectIdlePeriods,
  calculateTotalHoverTime,
  trackAnswerChange,
  trackAction,
  startHover,
  endHover,
  isSequenceCorrect,
  countMisplacements
} from '../lib/cognitiveUtils';

type AssessmentState = {
  conservation: ConservationTrackingState;
  classification: ClassificationTrackingState;
  seriation: SeriationTrackingState;
  reversibility: BaseTrackingState;
  hypothetical: BaseTrackingState;
};

const TOTAL_SCREENS = 7;

export const CognitiveAssessmentFlowNew: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState(1);
  
  const createInitialTrackingState = (): BaseTrackingState => ({
    startTime: null,
    firstActionTime: null,
    lastActionTime: null,
    actionTimestamps: [],
    answerChanges: 0,
    currentAnswer: null,
    hoverTimes: {},
    hoverStartTimes: {},
    totalHoverTime: 0,
    idlePeriods: 0
  });

  const [assessmentState, setAssessmentState] = useState<AssessmentState>({
    conservation: { ...createInitialTrackingState(), correctness: null },
    classification: { ...createInitialTrackingState(), corrections: 0, lastGroupAssignment: {} },
    seriation: { ...createInitialTrackingState(), swaps: 0, misplacements: 0, firstCorrectTime: null, currentOrder: [], correctOrder: ['shortest', 'short', 'medium', 'long', 'longest'] },
    reversibility: createInitialTrackingState(),
    hypothetical: createInitialTrackingState()
  });
  
  const [results, setResults] = useState<AssessmentResponse | null>(null);
  const { submitAssessment, loading, error, alreadyCompleted } = useCognitiveAssessment();
  const router = useRouter();

  const getProgressPercentage = () => {
    return ((currentScreen - 1) / (TOTAL_SCREENS - 1)) * 100;
  };

  const nextScreen = () => {
    if (currentScreen < TOTAL_SCREENS) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handleFinishAssessment = async () => {
    const { conservation, classification, seriation, reversibility, hypothetical } = assessmentState;
    
    // Calculate bands for each question
    const conservationTime = conservation.startTime ? Date.now() - conservation.startTime : 0;
    const classificationTime = classification.startTime ? Date.now() - classification.startTime : 0;
    const seriationTime = seriation.startTime ? Date.now() - seriation.startTime : 0;
    const reversibilityTime = reversibility.startTime ? Date.now() - reversibility.startTime : 0;
    const hypotheticalTime = hypothetical.startTime ? Date.now() - hypothetical.startTime : 0;
    
    // Debug logging for reaction times
    const conservationRT = conservation.firstActionTime && conservation.startTime 
      ? conservation.firstActionTime - conservation.startTime : 0;
    const reversibilityRT = reversibility.firstActionTime && reversibility.startTime 
      ? reversibility.firstActionTime - reversibility.startTime : 0;
    const hypotheticalRT = hypothetical.firstActionTime && hypothetical.startTime 
      ? hypothetical.firstActionTime - hypothetical.startTime : 0;

    console.log('=== COGNITIVE ASSESSMENT DEBUG ===');
    console.log('Reaction Times Debug:');
    console.log('Conservation - StartTime:', conservation.startTime, 'FirstActionTime:', conservation.firstActionTime);
    console.log('Conservation RT (ms):', conservationRT, 'RT Band:', calculateRTBand(conservationRT));
    console.log('Reversibility - StartTime:', reversibility.startTime, 'FirstActionTime:', reversibility.firstActionTime);
    console.log('Reversibility RT (ms):', reversibilityRT, 'RT Band:', calculateRTBand(reversibilityRT));
    console.log('Hypothetical - StartTime:', hypothetical.startTime, 'FirstActionTime:', hypothetical.firstActionTime);
    console.log('Hypothetical RT (ms):', hypotheticalRT, 'RT Band:', calculateRTBand(hypotheticalRT));
    
    console.log('Answer Changes Debug:');
    console.log('Conservation AC:', conservation.answerChanges, 'AC Band:', calculateACBand(conservation.answerChanges));
    console.log('Reversibility AC:', reversibility.answerChanges, 'AC Band:', calculateACBand(reversibility.answerChanges));
    console.log('Hypothetical AC:', hypothetical.answerChanges, 'AC Band:', calculateACBand(hypothetical.answerChanges));
    
    console.log('Hover Times Debug:');
    console.log('Conservation Hover (ms):', conservation.totalHoverTime, 'H Band:', calculateHBand(conservation.totalHoverTime));
    console.log('Reversibility Hover (ms):', reversibility.totalHoverTime, 'H Band:', calculateHBand(reversibility.totalHoverTime));
    console.log('Hypothetical Hover (ms):', hypothetical.totalHoverTime, 'H Band:', calculateHBand(hypothetical.totalHoverTime));
    
    console.log('Classification Debug:');
    console.log('Corrections:', classification.corrections, 'Corr Band:', calculateCorrBand(classification.corrections));
    console.log('Idle Periods:', detectIdlePeriods(classification.actionTimestamps), 'Idle Band:', calculateIdleBand(detectIdlePeriods(classification.actionTimestamps)));
    console.log('Classification Time (ms):', classificationTime, 'T Band:', calculateTBand(classificationTime));
    
    console.log('Seriation Debug:');
    console.log('Swaps:', seriation.swaps, 'S Band:', calculateSBand(seriation.swaps));
    console.log('Misplacements:', seriation.misplacements, 'M Band:', calculateMBand(seriation.misplacements));
    console.log('First Correct Time:', seriation.firstCorrectTime, 'TP Band:', seriation.firstCorrectTime && seriation.startTime ? calculateTPBand(seriation.firstCorrectTime - seriation.startTime) : 2);

    const payload: AssessmentPayload = {
      question1_conservation: {
        rt_band: calculateRTBand(conservationRT),
        h_band: calculateHBand(conservation.totalHoverTime),
        ac: calculateACBand(conservation.answerChanges),
        correctness: conservation.correctness || false
      },
      question2_classification: {
        corr_band: calculateCorrBand(classification.corrections),
        idle_band: calculateIdleBand(detectIdlePeriods(classification.actionTimestamps)),
        t_band: calculateTBand(classificationTime)
      },
      question3_seriation: {
        s_band: calculateSBand(seriation.swaps),
        m_band: calculateMBand(seriation.misplacements),
        tp_band: seriation.firstCorrectTime && seriation.startTime 
          ? calculateTPBand(seriation.firstCorrectTime - seriation.startTime) : 2,
        t_band: calculateTBand(seriationTime)
      },
      question4_reversibility: {
        rt_band: calculateRTBand(reversibilityRT),
        h_band: calculateHBand(reversibility.totalHoverTime),
        ac: calculateACBand(reversibility.answerChanges),
        correctness: reversibility.currentAnswer === 'yes' // 'yes' is correct - clay amount stays the same
      },
      question5_hypothetical: {
        rt_band: calculateRTBand(hypotheticalRT),
        h_band: calculateHBand(hypothetical.totalHoverTime),
        ac: calculateACBand(hypothetical.answerChanges),
        correctness: hypothetical.currentAnswer === 'D' // Option D shows formal operational thinking
      }
    };

    console.log('FINAL PAYLOAD:', payload);
    console.log('Assessment payload:', payload);
    const response = await submitAssessment(payload);
    if (response) {
      setResults(response);
      nextScreen();
    }
  };

  useEffect(() => {
    if (currentScreen >= 2 && currentScreen <= 6) {
      const startTime = Date.now();
      
      // Initialize tracking state for current screen
      const screenKey = [
        'conservation', 'classification', 'seriation', 'reversibility', 'hypothetical'
      ][currentScreen - 2] as keyof AssessmentState;
      
      setAssessmentState(prev => ({
        ...prev,
        [screenKey]: {
          ...prev[screenKey],
          startTime,
          actionTimestamps: []
        }
      }));
    }
  }, [currentScreen]);

  if (alreadyCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Assessment Complete</h2>
            <p className="text-gray-600 mb-4">You've already completed your Learning Fingerprint.</p>
            <Button onClick={() => router.push('/dashboard/parent')} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-blue-600 mr-2" />
            <CardTitle className="text-2xl">Learning Fingerprint Assessment</CardTitle>
          </div>
          {currentScreen > 1 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Question {currentScreen - 1} of 5</span>
                <span>{Math.round(getProgressPercentage())}% complete</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6">
          {currentScreen === 1 && (
            <WelcomeScreen onStart={nextScreen} />
          )}
          {currentScreen === 2 && (
            <ConservationScreenNew 
              state={assessmentState.conservation}
              setState={(newState) => setAssessmentState(prev => ({ ...prev, conservation: newState }))}
              onNext={nextScreen}
            />
          )}
          {currentScreen === 3 && (
            <ClassificationScreenNew 
              state={assessmentState.classification}
              setState={(newState) => setAssessmentState(prev => ({ ...prev, classification: newState }))}
              onNext={nextScreen}
            />
          )}
          {currentScreen === 4 && (
            <SeriationScreenNew 
              state={assessmentState.seriation}
              setState={(newState) => setAssessmentState(prev => ({ ...prev, seriation: newState }))}
              onNext={nextScreen}
            />
          )}
          {currentScreen === 5 && (
            <ReversibilityScreenNew 
              state={assessmentState.reversibility}
              setState={(newState) => setAssessmentState(prev => ({ ...prev, reversibility: newState }))}
              onNext={nextScreen}
            />
          )}
          {currentScreen === 6 && (
            <HypotheticalScreenNew 
              state={assessmentState.hypothetical}
              setState={(newState) => setAssessmentState(prev => ({ ...prev, hypothetical: newState }))}
              onFinish={handleFinishAssessment}
              loading={loading}
              error={error}
            />
          )}
          {currentScreen === 7 && results && (
            <ResultsScreenNew 
              results={results}
              onComplete={() => router.push('/dashboard/parent')}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Welcome Screen Component (unchanged)
const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
        <Brain className="w-24 h-24 text-blue-600" />
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          We're about to understand how YOUR child's brain learns
        </h2>
        <p className="text-lg text-gray-600">This takes about 90 seconds</p>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          We'll ask you a few quick questions to create your personalized learning profile.
        </p>
      </div>
      <Button onClick={onStart} size="lg" className="px-8">
        Start Assessment
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

// Conservation Screen with enhanced tracking
const ConservationScreenNew: React.FC<{
  state: ConservationTrackingState;
  setState: (state: ConservationTrackingState) => void;
  onNext: () => void;
}> = ({ state, setState, onNext }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    const now = Date.now();
    
    // Track answer changes
    const { answerChanges, currentAnswer } = trackAnswerChange(state.currentAnswer, option, state.answerChanges);
    
    // Single setState call to avoid overwriting firstActionTime
    setState({
      ...state,
      firstActionTime: state.firstActionTime || now, // Set only if not already set
      answerChanges,
      currentAnswer,
      correctness: option === 'A', // Assuming A is correct
      actionTimestamps: trackAction(state.actionTimestamps),
      lastActionTime: now
    });

    setSelectedOption(option);
  };

  const handleOptionHover = (optionId: string, isEntering: boolean) => {
    if (isEntering) {
      const newStartTimes = startHover(optionId, state.hoverStartTimes);
      setState({
        ...state,
        hoverStartTimes: newStartTimes
      });
    } else {
      const { hoverTimes, hoverStartTimes } = endHover(optionId, state.hoverStartTimes, state.hoverTimes);
      setState({
        ...state,
        hoverTimes,
        hoverStartTimes,
        totalHoverTime: calculateTotalHoverTime(hoverTimes)
      });
    }
  };

  const handleNext = () => {
    if (selectedOption) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Conservation Task</h3>
        <p className="text-gray-600">Look at these two containers with water:</p>
      </div>
      
      <div className="flex justify-center my-8">
        <video 
          width="400" 
          height="300" 
          controls 
          className="rounded-lg shadow-lg"
          autoPlay
          muted
        >
          <source src="/beakers.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-700 mb-4">
          Which container will have more water?
        </p>
      </div>

      <RadioGroup value={selectedOption || ""} onValueChange={handleOptionSelect} className="space-y-4">
        {[
          { id: 'A', label: 'Container A has more water' },
          { id: 'B', label: 'Container B has more water' },
          { id: 'C', label: 'They have the same amount of water' }
        ].map((option) => (
          <div 
            key={option.id}
            className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onMouseEnter={() => handleOptionHover(option.id, true)}
            onMouseLeave={() => handleOptionHover(option.id, false)}
          >
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id} className="flex-1 cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={!selectedOption}
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

// Placeholder for other screens - will implement these next
const ClassificationScreenNew: React.FC<{
  state: ClassificationTrackingState;
  setState: (state: ClassificationTrackingState) => void;
  onNext: () => void;
}> = ({ state, setState, onNext }) => {
  const [draggedShape, setDraggedShape] = useState<string | null>(null);
  const [canProceed, setCanProceed] = useState(false);
  
  // Initial shapes with properties
  const initialShapes = [
    { id: 'red-circle', shape: 'circle', color: 'red', group: 'available' },
    { id: 'blue-circle', shape: 'circle', color: 'blue', group: 'available' },
    { id: 'red-square', shape: 'square', color: 'red', group: 'available' },
    { id: 'blue-square', shape: 'square', color: 'blue', group: 'available' },
    { id: 'green-triangle', shape: 'triangle', color: 'green', group: 'available' },
    { id: 'yellow-triangle', shape: 'triangle', color: 'yellow', group: 'available' }
  ];

  const [shapes, setShapes] = useState(() => {
    // Shuffle the initial shapes array to randomize order
    const shuffled = [...initialShapes].sort(() => Math.random() - 0.5);
    return shuffled;
  });
  const [groups] = useState(['group1', 'group2', 'group3']);

  const handleDragStart = (e: React.DragEvent, shapeId: string) => {
    setDraggedShape(shapeId);
    e.dataTransfer.setData('text/plain', shapeId);
    
    // Track action
    const now = Date.now();
    
    setState({
      ...state,
      firstActionTime: state.firstActionTime || now,
      actionTimestamps: trackAction(state.actionTimestamps),
      lastActionTime: now
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetGroup: string) => {
    e.preventDefault();
    const shapeId = e.dataTransfer.getData('text/plain');
    
    if (!shapeId) return;

    const shape = shapes.find(s => s.id === shapeId);
    if (!shape) return;

    // Track group change (correction)
    const previousGroup = state.lastGroupAssignment[shapeId] || 'available';
    const isCorrection = previousGroup !== 'available' && previousGroup !== targetGroup;
    
    // Update shapes
    setShapes(prev => prev.map(s => 
      s.id === shapeId ? { ...s, group: targetGroup } : s
    ));

    // Update tracking state
    const newGroupAssignment = { ...state.lastGroupAssignment, [shapeId]: targetGroup };
    const corrections = isCorrection ? state.corrections + 1 : state.corrections;
    
    setState({
      ...state,
      corrections,
      lastGroupAssignment: newGroupAssignment,
      actionTimestamps: trackAction(state.actionTimestamps),
      lastActionTime: Date.now()
    });

    setDraggedShape(null);
    
    // Check if enough items are grouped to proceed
    const groupedItems = shapes.filter(s => groups.includes(s.group)).length;
    setCanProceed(groupedItems >= 4); // At least 4 items should be grouped
  };

  const renderShape = (shape: any) => {
    const getShapeElement = () => {
      const baseClasses = "w-12 h-12 flex items-center justify-center text-white font-bold";
      
      switch (shape.shape) {
        case 'circle':
          return (
            <div 
              className={`${baseClasses} rounded-full`}
              style={{ backgroundColor: shape.color }}
            >
              ●
            </div>
          );
        case 'square':
          return (
            <div 
              className={`${baseClasses} rounded-sm`}
              style={{ backgroundColor: shape.color }}
            >
              ■
            </div>
          );
        case 'triangle': {
          // Use dark triangle on light backgrounds, light triangle on dark backgrounds
          const getTriangleColor = (bgColor: string) => {
            const lightColors = ['yellow', 'lime', 'cyan', 'white', 'lightgray', 'pink', 'lightblue'];
            return lightColors.includes(bgColor.toLowerCase()) ? '#1f2937' : 'white';
          };
          
          return (
            <div 
              className={`${baseClasses} relative`}
              style={{ backgroundColor: shape.color }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-0 h-0 border-l-[18px] border-r-[18px] border-b-[16px] border-l-transparent border-r-transparent"
                  style={{ borderBottomColor: getTriangleColor(shape.color) }}
                />
              </div>
            </div>
          );
        }
        default:
          return null;
      }
    };

    return (
      <div
        key={shape.id}
        draggable
        onDragStart={(e) => handleDragStart(e, shape.id)}
        className="cursor-move hover:opacity-70 p-2"
      >
        {getShapeElement()}
      </div>
    );
  };

  const handleNext = () => {
    if (canProceed) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Classification Task</h3>
        <p className="text-gray-600">Group these shapes by dragging them into the boxes below:</p>
        <p className="text-sm text-gray-500">You can group them by color, shape, or any pattern you see</p>
      </div>

      {/* Available shapes */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3">Available Shapes:</h4>
        <div className="flex flex-wrap gap-2 justify-center">
          {shapes.filter(s => s.group === 'available').map(renderShape)}
        </div>
      </div>

      {/* Drop zones */}
      <div className="grid grid-cols-3 gap-4">
        {groups.map((group, index) => (
          <div
            key={group}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, group)}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-32 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <h4 className="font-medium mb-2 text-center">Group {index + 1}</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {shapes.filter(s => s.group === group).map(renderShape)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Groups made: {state.corrections} corrections
        </p>
        <Button 
          onClick={handleNext}
          disabled={!canProceed}
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const SeriationScreenNew: React.FC<{
  state: SeriationTrackingState;
  setState: (state: SeriationTrackingState) => void;
  onNext: () => void;
}> = ({ state, setState, onNext }) => {
  // Initialize items if not already set
  const initialItems = ['shortest', 'short', 'medium', 'long', 'longest'];
  const [currentOrder, setCurrentOrder] = useState(
    state.currentOrder.length > 0 ? state.currentOrder : [...initialItems].sort(() => Math.random() - 0.5)
  );
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [canProceed, setCanProceed] = useState(false);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Track first action
    const now = Date.now();
    
    setState({
      ...state,
      firstActionTime: state.firstActionTime || now,
      actionTimestamps: trackAction(state.actionTimestamps),
      lastActionTime: now
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex === dropIndex) return;

    // Create new order
    const newOrder = [...currentOrder];
    const draggedItem = newOrder[dragIndex];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);
    
    setCurrentOrder(newOrder);
    
    // Track swaps and misplacements
    const swaps = state.swaps + 1;
    const misplacements = countMisplacements(newOrder, state.correctOrder);
    
    // Check if this is the first correct placement
    let firstCorrectTime = state.firstCorrectTime;
    if (!firstCorrectTime && isSequenceCorrect(newOrder, state.correctOrder)) {
      firstCorrectTime = Date.now();
    }

    setState({
      ...state,
      currentOrder: newOrder,
      swaps,
      misplacements,
      firstCorrectTime,
      actionTimestamps: trackAction(state.actionTimestamps),
      lastActionTime: Date.now()
    });

    // Check if sequence is complete (allow proceeding even if not perfectly correct)
    setCanProceed(true);
    setDraggedIndex(null);
  };

  const getItemSize = (item: string) => {
    switch (item) {
      case 'shortest': return { width: '40px', height: '60px' };
      case 'short': return { width: '40px', height: '100px' };
      case 'medium': return { width: '40px', height: '140px' };
      case 'long': return { width: '40px', height: '180px' };
      case 'longest': return { width: '40px', height: '220px' };
      default: return { width: '40px', height: '140px' };
    }
  };

  const getItemColor = (item: string) => {
    switch (item) {
      case 'shortest': return 'bg-gradient-to-t from-blue-600 to-blue-400';
      case 'short': return 'bg-gradient-to-t from-green-600 to-green-400';
      case 'medium': return 'bg-gradient-to-t from-yellow-600 to-yellow-400';
      case 'long': return 'bg-gradient-to-t from-orange-600 to-orange-400';
      case 'longest': return 'bg-gradient-to-t from-red-600 to-red-400';
      default: return 'bg-gray-400';
    }
  };

  const handleNext = () => {
    if (canProceed) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Seriation Task (Ordering)</h3>
        <p className="text-gray-600">Arrange these rods from shortest to longest by dragging them:</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-center items-end space-x-4 min-h-32">
          {currentOrder.map((item, index) => {
            const size = getItemSize(item);
            const colorClass = getItemColor(item);
            
            return (
              <div
                key={`${item}-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`${colorClass} rounded-lg cursor-move hover:opacity-80 hover:scale-105 transition-all duration-200 flex items-end justify-center text-white font-bold text-xs shadow-lg border border-white/20`}
                style={size}
              >
                <span className="mb-2">{index + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 space-y-1">
        <p>Arrange these bars from shortest to longest.</p>
        <p>Current order: {currentOrder.map(item => item.charAt(0).toUpperCase()).join(' → ')}</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <p>Swaps made: {state.swaps}</p>
          <p>Misplacements: {state.misplacements}</p>
        </div>
        <Button 
          onClick={handleNext}
          disabled={!canProceed}
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const ReversibilityScreenNew: React.FC<{
  state: BaseTrackingState;
  setState: (state: BaseTrackingState) => void;
  onNext: () => void;
}> = ({ state, setState, onNext }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    const now = Date.now();

    // Track answer changes
    const { answerChanges, currentAnswer } = trackAnswerChange(state.currentAnswer, option, state.answerChanges);
    
    setState({
      ...state,
      firstActionTime: state.firstActionTime || now,
      answerChanges,
      currentAnswer,
      actionTimestamps: trackAction(state.actionTimestamps),
      lastActionTime: now
    });

    setSelectedAnswer(option);
  };

  const handleOptionHover = (optionId: string, isEntering: boolean) => {
    if (isEntering) {
      const newStartTimes = startHover(optionId, state.hoverStartTimes);
      setState({
        ...state,
        hoverStartTimes: newStartTimes
      });
    } else {
      const { hoverTimes, hoverStartTimes } = endHover(optionId, state.hoverStartTimes, state.hoverTimes);
      setState({
        ...state,
        hoverTimes,
        hoverStartTimes,
        totalHoverTime: calculateTotalHoverTime(hoverTimes)
      });
    }
  };

  const handleNext = () => {
    if (selectedAnswer) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Reversibility Reasoning</h3>
        <p className="text-gray-600">Watch this scenario:</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <div className="text-lg font-medium mb-4">
          🟫 Short scenario animation:
        </div>
        <div className="space-y-2 text-gray-700">
          <div>A clay ball → shaped into a pancake → shaped back into a ball.</div>
        </div>
        <div className="text-xl font-semibold mt-4 text-gray-800">
          Does the clay still have the SAME amount as before?
        </div>
      </div>

      <RadioGroup value={selectedAnswer || ""} onValueChange={handleOptionSelect} className="space-y-4">
        {[
          { id: 'yes', label: 'Yes' },
          { id: 'no', label: 'No' },
          { id: 'unsure', label: 'Not sure' }
        ].map((option) => (
          <div 
            key={option.id}
            className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onMouseEnter={() => handleOptionHover(option.id, true)}
            onMouseLeave={() => handleOptionHover(option.id, false)}
          >
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id} className="flex-1 cursor-pointer text-left">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={!selectedAnswer}
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const HypotheticalScreenNew: React.FC<{
  state: BaseTrackingState;
  setState: (state: BaseTrackingState) => void;
  onFinish: () => void;
  loading: boolean;
  error: string | null;
}> = ({ state, setState, onFinish, loading, error }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    const now = Date.now();

    // Track answer changes
    const { answerChanges, currentAnswer } = trackAnswerChange(state.currentAnswer, option, state.answerChanges);
    
    setState({
      ...state,
      firstActionTime: state.firstActionTime || now,
      answerChanges,
      currentAnswer,
      actionTimestamps: trackAction(state.actionTimestamps),
      lastActionTime: now
    });

    setSelectedAnswer(option);
  };

  const handleOptionHover = (optionId: string, isEntering: boolean) => {
    if (isEntering) {
      const newStartTimes = startHover(optionId, state.hoverStartTimes);
      setState({
        ...state,
        hoverStartTimes: newStartTimes
      });
    } else {
      const { hoverTimes, hoverStartTimes } = endHover(optionId, state.hoverStartTimes, state.hoverTimes);
      setState({
        ...state,
        hoverTimes,
        hoverStartTimes,
        totalHoverTime: calculateTotalHoverTime(hoverTimes)
      });
    }
  };

  const handleFinish = () => {
    if (selectedAnswer) {
      onFinish();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Hypothetical Thinking Task</h3>
        <p className="text-gray-600">Think about this imaginary situation:</p>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="text-lg font-medium mb-4 text-center">
          🌱 Scenario:
        </div>
        <p className="text-gray-700 text-center leading-relaxed mb-4">
          "A plant grows taller when it gets sunlight.
        </p>
        <p className="text-xl font-semibold text-center text-gray-800">
          If we gave it twice the sunlight, what might happen?"
        </p>
      </div>

      <RadioGroup value={selectedAnswer || ""} onValueChange={handleOptionSelect} className="space-y-4">
        {[
          { 
            id: 'A', 
            label: 'A) Grow twice as tall'
          },
          { 
            id: 'B', 
            label: 'B) Grow slightly faster' 
          },
          { 
            id: 'C', 
            label: 'C) Stay the same'
          },
          { 
            id: 'D', 
            label: 'D) Might grow OR might not — depends on other factors'
          }
        ].map((option) => (
          <div 
            key={option.id}
            className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onMouseEnter={() => handleOptionHover(option.id, true)}
            onMouseLeave={() => handleOptionHover(option.id, false)}
          >
            <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
            <Label htmlFor={option.id} className="flex-1 cursor-pointer text-left leading-relaxed">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {error && (
        <div className="text-red-500 text-center p-3 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleFinish}
          disabled={!selectedAnswer || loading}
          size="lg"
        >
          {loading ? 'Processing Assessment...' : 'Finish Assessment'}
          {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

// New Results Screen for 9 cognitive parameters
const ResultsScreenNew: React.FC<{
  results: AssessmentResponse;
  onComplete: () => void;
}> = ({ results, onComplete }) => {
  const cognitiveParameters = [
    { key: 'confidence', name: 'Confidence', parameter: results.confidence },
    { key: 'working_memory', name: 'Working Memory', parameter: results.working_memory },
    { key: 'anxiety', name: 'Anxiety', parameter: results.anxiety },
    { key: 'precision', name: 'Precision', parameter: results.precision },
    { key: 'error_correction_ability', name: 'Error Correction', parameter: results.error_correction_ability },
    { key: 'impulsivity', name: 'Impulsivity', parameter: results.impulsivity },
    { key: 'working_memory_load_handling', name: 'Load Handling', parameter: results.working_memory_load_handling },
    { key: 'processing_speed', name: 'Processing Speed', parameter: results.processing_speed },
    { key: 'exploratory_nature', name: 'Exploration', parameter: results.exploratory_nature },
  ];

  const getBarWidth = (finalScore: number) => {
    // Map final scores (10,30,50,70,90) to proper percentages (20,40,60,80,100)
    const scoreMap: { [key: number]: number } = {
      10: 20,   // Very Low -> 20%
      30: 40,   // Emerging -> 40%  
      50: 60,   // Developing -> 60%
      70: 80,   // Proficient -> 80%
      90: 100   // Advanced -> 100%
    };
    return scoreMap[finalScore] || 60; // Default to 60% if score not found
  };

  const getScoreColor = (parameterKey: string, finalScore: number) => {
    // For anxiety and exploration: LOW is good (green), HIGH is bad (red)
    const reversedParameters = ['anxiety', 'exploratory_nature'];
    const isReversed = reversedParameters.includes(parameterKey);
    
    if (isReversed) {
      // For anxiety/exploration: low scores are good (green), high scores are bad (red)
      if (finalScore <= 30) return 'bg-emerald-500';  // Low = Good (Green)
      if (finalScore <= 50) return 'bg-sky-500';      // Medium = Neutral (Blue)  
      if (finalScore <= 70) return 'bg-amber-500';    // High = Caution (Yellow)
      return 'bg-rose-500';                           // Very High = Bad (Red)
    } else {
      // For other parameters: high scores are good (green), low scores are bad (red)
      if (finalScore >= 70) return 'bg-emerald-500';  // High = Good (Green)
      if (finalScore >= 50) return 'bg-sky-500';      // Medium = Neutral (Blue)
      if (finalScore >= 30) return 'bg-amber-500';    // Low = Caution (Yellow) 
      return 'bg-rose-500';                           // Very Low = Bad (Red)
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Image 
            src="/fingerprint.jpeg" 
            alt="Fingerprint" 
            width={120} 
            height={120} 
            className="object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Your Learning Fingerprint</h2>
        <p className="text-gray-600">Here's how your brain learns best</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Your Learning Profile</h3>
        
        {cognitiveParameters.map((item) => {
          const isReversedParam = ['anxiety', 'exploratory_nature'].includes(item.key);
          return (
            <div key={item.key} className="bg-gray-50/80 p-4 rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-all hover:bg-white/90">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800 text-base">{item.name}</span>
                  {isReversedParam && (
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                      Lower is better
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded-md text-xs font-medium text-white ${getScoreColor(item.key, item.parameter.final_score)}`}>
                    {item.parameter.label}
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${getScoreColor(item.key, item.parameter.final_score)}`}
                  style={{ width: `${getBarWidth(item.parameter.final_score)}%` }}
                />
              </div>
              <div className="bg-white/70 p-3 rounded-md border-l-4 border-l-gray-300">
                <p className="text-sm text-gray-700 leading-relaxed">{item.parameter.interpretation}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50/70 p-5 rounded-md border border-slate-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Summary</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{results.final_summary}</p>
      </div>

      <div className="flex justify-center">
        <Button onClick={onComplete} size="lg" className="px-8">
          Continue to Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};