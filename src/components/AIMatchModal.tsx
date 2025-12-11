import React from 'react';
import { X, Sparkles, Brain, Users, Clock, MapPin, DollarSign, CheckCircle, Info, Star, User, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TutorMatch {
  tutor: {
    id: string;
    name: string;
    email: string;
    primary_contact: string;
    secondary_contact?: string;
    state: string;
    area: string;
    pincode: string;
    latitude: string;
    longitude: string;
    profile_pic?: string;
    introduction?: string;
    teaching_desc?: string;
    lesson_price: string;
    teaching_mode: "ONLINE" | "OFFLINE" | "BOTH";
    subscription_validity?: string;
    basic_done: boolean;
    location_done: boolean;
    later_onboarding_done: boolean;
    class_level?: string;
    current_status?: string;
    degree?: string;
    university?: string;
    referral?: string;
    created_at: string;
    updated_at: string;
    subjects: string;
  };
  match_details: {
    compatibility_score: number;
    reasoning: string;
    subject_explanation: string;
  };
}

interface AIMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: TutorMatch[];
  loading: boolean;
  error: string | null;
}

const AIMatchModal: React.FC<AIMatchModalProps> = ({
  isOpen,
  onClose,
  matches,
  loading,
  error
}) => {
  if (!isOpen) return null;

  const handleTutorClick = (tutor: any) => {
    // Store tutor data in localStorage for the profile page (same as TutorCard)
    localStorage.setItem(`tutor_${tutor.id}`, JSON.stringify(tutor));
    // Open in new tab to avoid navigation issues
    window.open(`/tutor/${tutor.id}`, '_blank');
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-emerald-700';
    if (score >= 60) return 'from-blue-500 to-blue-700';
    if (score >= 40) return 'from-amber-500 to-amber-700';
    return 'from-rose-500 to-rose-700';
  };

  const parseSubjects = (subjectsString: string | null | undefined): string[] => {
    if (!subjectsString) {
      return [];
    }
    try {
      return JSON.parse(subjectsString.replace(/'/g, '"'));
    } catch {
      return subjectsString.split(',').map(s => s.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">AI-Powered Matches</h2>
                <p className="text-gray-600">Handpicked tutors based on your learning profile</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full h-10 w-10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-8">
                <div className="w-16 h-16 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
                </div>
              </div>
              <div className="text-center max-w-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Finding your perfect tutors...</h3>
                <p className="text-gray-600 mb-4">Our AI is analyzing your learning profile and matching you with the best educators</p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  This may take a few minutes
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl mb-6">
                <Sparkles className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Premium Feature</h3>
              <p className="text-center text-gray-600 max-w-md mb-6">{error}</p>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg shadow-lg" 
                onClick={() => window.open('/dashboard/parent/subscription', '_blank')}
              >
                Explore Subscription Plans
              </Button>
            </div>
          )}

          {!loading && !error && matches.length > 0 && (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full mb-3">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{matches.length} Perfect Matches Found!</span>
                </div>
                <p className="text-gray-600">AI-curated tutors personalized for your learning journey</p>
              </div>

              <div className="grid gap-8">
                {matches.map((match, index) => (
                  <div
                    key={match.tutor.id}
                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-500 cursor-pointer relative"
                    onClick={() => handleTutorClick(match.tutor)}
                  >
                    <div className="flex">
                      {/* Vertical Tutor Picture - Left Side */}
                      <div className="relative w-48 h-80 flex-shrink-0 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
                        {match.tutor.profile_pic ? (
                          <img
                            src={match.tutor.profile_pic}
                            alt={match.tutor.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            <div className="text-6xl font-bold mb-4">
                              {match.tutor.name.charAt(0).toUpperCase()}
                            </div>
                            <User className="w-12 h-12 opacity-60" />
                          </div>
                        )}
                        
                        {/* Match Rank Overlay */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-bold text-gray-700 shadow-lg">
                            #{index + 1}
                          </div>
                        </div>

                        {/* Compatibility Score Overlay */}
                        <div className="absolute bottom-4 left-4">
                          <div className={`bg-gradient-to-r ${getScoreGradient(match.match_details.compatibility_score)} text-white rounded-xl px-3 py-2 shadow-lg`}>
                            <div className="text-center">
                              <div className="text-xl font-bold">{Math.round(match.match_details.compatibility_score)}%</div>
                              <div className="text-xs opacity-90">Match</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Area - Right Side */}
                      <div className="flex-1 p-6">
                        {/* Header Info */}
                        <div className="mb-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">
                              {match.tutor.name}
                            </h3>
                            <div className="flex items-center gap-1 text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 font-medium mb-3">{match.tutor.current_status || 'Professional Tutor'}</p>
                          
                          {/* Key Info Grid */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{match.tutor.area}, {match.tutor.state}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-gray-500" />
                              <span className="font-semibold text-gray-900">₹{match.tutor.lesson_price}/session</span>
                            </div>
                          </div>

                          {/* Teaching Mode Badge */}
                          <div className="mb-4">
                            <Badge className={`${match.tutor.teaching_mode === 'ONLINE' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'} border-0`}>
                              {match.tutor.teaching_mode === 'ONLINE' ? (
                                <>
                                  <Video className="w-3 h-3 mr-1" />
                                  Online Classes
                                </>
                              ) : (
                                <>
                                  <Users className="w-3 h-3 mr-1" />
                                  {match.tutor.teaching_mode}
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>

                        {/* Subjects */}
                        <div className="mb-6">
                          <p className="text-sm font-semibold text-gray-800 mb-2">Teaching Subjects</p>
                          <div className="flex flex-wrap gap-2">
                            {parseSubjects(match.tutor.subjects).slice(0, 5).map((subject, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-gray-100 text-gray-700 border-0 text-xs px-2 py-1">
                                {subject}
                              </Badge>
                            ))}
                            {parseSubjects(match.tutor.subjects).length > 5 && (
                              <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                                +{parseSubjects(match.tutor.subjects).length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Introduction */}
                        {match.tutor.introduction && (
                          <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-800 mb-2">About</p>
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                              {match.tutor.introduction}
                            </p>
                          </div>
                        )}

                        {/* AI Insights */}
                        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-blue-600" />
                            <p className="text-sm font-semibold text-gray-800">AI Match Insights</p>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-sm text-gray-700 cursor-help">
                                  <p className="mb-1">🎯 {match.match_details.reasoning}</p>
                                  <p className="text-xs text-blue-600 flex items-center gap-1">
                                    <Info className="w-3 h-3" />
                                    Click for detailed analysis
                                  </p>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs p-3">
                                <div className="text-xs">
                                  <p className="font-medium mb-1">Match Analysis:</p>
                                  <p className="mb-2">{match.match_details.reasoning}</p>
                                  <p className="font-medium mb-1">Subject Compatibility:</p>
                                  <p>{match.match_details.subject_explanation}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end">
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all">
                            View Full Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && matches.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-4 bg-gray-100 rounded-2xl mb-6">
                <Users className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">No Matches Found</h3>
              <p className="text-center text-gray-600 max-w-md">
                We couldn't find any tutors matching your preferences right now. Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIMatchModal;