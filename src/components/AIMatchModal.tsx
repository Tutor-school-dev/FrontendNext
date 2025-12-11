import React from 'react';
import { X, Sparkles, Brain, Users, Clock, MapPin, DollarSign, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  if (!isOpen) return null;

  const handleTutorClick = (tutorId: string) => {
    router.push(`/tutor/${tutorId}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  const parseSubjects = (subjectsString: string): string[] => {
    try {
      return JSON.parse(subjectsString.replace(/'/g, '"'));
    } catch {
      return subjectsString.split(',').map(s => s.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI-Powered Matches</h2>
                <p className="text-white/80">Personalized tutor recommendations just for you</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6"></div>
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-600 animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Finding best tutors for you...</h3>
                <p className="text-gray-600">Our AI is analyzing thousands of profiles to find your perfect match</p>
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  This might take a few minutes
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-red-100 rounded-full mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Upgrade Required</h3>
              <p className="text-center text-gray-600 max-w-md">{error}</p>
              <Button className="mt-4" onClick={() => router.push('/dashboard/parent/subscription')}>
                View Subscription Plans
              </Button>
            </div>
          )}

          {!loading && !error && matches.length > 0 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Perfect Matches Found!</span>
                </div>
                <p className="text-gray-600">Here are your top {matches.length} AI-recommended tutors</p>
              </div>

              <div className="grid gap-6">
                {matches.map((match, index) => (
                  <div
                    key={match.tutor.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden"
                    onClick={() => handleTutorClick(match.tutor.id)}
                  >
                    {/* Rank Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                        #{index + 1} Match
                      </Badge>
                    </div>

                    {/* Compatibility Score */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-12 h-12 ${getScoreColor(match.match_details.compatibility_score)} rounded-full flex items-center justify-center text-white font-bold`}>
                          {Math.round(match.match_details.compatibility_score)}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Compatibility</p>
                          <p className="text-sm font-medium text-gray-700">
                            {Math.round(match.match_details.compatibility_score)}% Match
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-16">
                      {/* Tutor Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {match.tutor.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {match.tutor.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">{match.tutor.current_status || 'Professional Tutor'}</p>
                          
                          {/* Location */}
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span>{match.tutor.area}, {match.tutor.state}</span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold">₹{match.tutor.lesson_price}/session</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {match.tutor.teaching_mode}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Subjects */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Subjects:</p>
                        <div className="flex flex-wrap gap-2">
                          {parseSubjects(match.tutor.subjects).slice(0, 4).map((subject, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                          {parseSubjects(match.tutor.subjects).length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{parseSubjects(match.tutor.subjects).length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Introduction */}
                      {match.tutor.introduction && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {match.tutor.introduction}
                        </p>
                      )}

                      {/* Match Details */}
                      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 text-sm text-purple-600 cursor-help">
                                <Info className="w-4 h-4" />
                                <span>Why this match?</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <div className="text-xs">
                                <p className="font-medium mb-1">Match Reasoning:</p>
                                <p className="mb-2">{match.match_details.reasoning}</p>
                                <p className="font-medium mb-1">Subject Analysis:</p>
                                <p>{match.match_details.subject_explanation}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <div className="flex-1" />
                        
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && matches.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Matches Found</h3>
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