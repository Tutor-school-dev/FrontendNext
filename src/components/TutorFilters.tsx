import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Search, Filter, X, Video, Users } from 'lucide-react';
import { SUBJECTS, getAllSubjects } from '@/lib/subjects';

export interface TutorFilters {
  subject?: string[];
  mode_of_teaching?: 'ONLINE' | 'OFFLINE';
}

interface TutorFiltersComponentProps {
  onFiltersChange: (filters: TutorFilters) => void;
  loading?: boolean;
}

const TutorFiltersComponent: React.FC<TutorFiltersComponentProps> = ({
  onFiltersChange,
  loading = false
}) => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [teachingMode, setTeachingMode] = useState<'ONLINE' | 'OFFLINE' | undefined>();
  const [subjectInput, setSubjectInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Use standardized subjects from backend API
  const availableSubjects = getAllSubjects();
  
  const filteredSuggestions = availableSubjects.filter(subject =>
    subject.toLowerCase().includes(subjectInput.toLowerCase()) &&
    !subjects.includes(subject)
  );

  const addSubject = (subject: string) => {
    if (subject.trim() && !subjects.includes(subject.trim())) {
      const newSubjects = [...subjects, subject.trim()];
      setSubjects(newSubjects);
      setSubjectInput('');
      setShowSuggestions(false);
      updateFilters(newSubjects, teachingMode);
    }
  };

  const removeSubject = (subject: string) => {
    const newSubjects = subjects.filter(s => s !== subject);
    setSubjects(newSubjects);
    updateFilters(newSubjects, teachingMode);
  };

  const handleTeachingModeChange = (mode: 'ONLINE' | 'OFFLINE' | 'ALL') => {
    const newMode = mode === 'ALL' ? undefined : mode;
    setTeachingMode(newMode);
    updateFilters(subjects, newMode);
  };

  const updateFilters = (newSubjects: string[], newMode?: 'ONLINE' | 'OFFLINE') => {
    const filters: TutorFilters = {};
    if (newSubjects.length > 0) {
      filters.subject = newSubjects;
    }
    if (newMode) {
      filters.mode_of_teaching = newMode;
    }
    onFiltersChange(filters);
  };

  const clearAllFilters = () => {
    setSubjects([]);
    setTeachingMode(undefined);
    setSubjectInput('');
    onFiltersChange({});
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && subjectInput.trim()) {
      addSubject(subjectInput);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Refine Your Search</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subject Filter */}
          <div className="space-y-3">
            <Label htmlFor="subjects" className="text-sm font-medium text-foreground">
              Subjects
            </Label>
            
            {/* Selected Subjects */}
            {subjects.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {subjects.map((subject, index) => (
                  <Badge key={index} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                    {subject}
                    <button
                      onClick={() => removeSubject(subject)}
                      className="ml-2 hover:bg-primary/30 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Subject Input */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="subjects"
                  placeholder="Search subjects (Mathematics, Physics, Chemistry, etc.)..."
                  value={subjectInput}
                  onChange={(e) => {
                    setSubjectInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowSuggestions(true)}
                  className="pl-10"
                />
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && subjectInput && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredSuggestions.slice(0, 10).map((subject, index) => (
                    <button
                      key={index}
                      onClick={() => addSubject(subject)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Teaching Mode Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Teaching Mode
            </Label>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={teachingMode === undefined ? "default" : "outline"}
                onClick={() => handleTeachingModeChange('ALL')}
                className={`text-sm ${teachingMode === undefined ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border-border hover:bg-muted'}`}
                disabled={loading}
              >
                All
              </Button>
              <Button
                variant={teachingMode === 'ONLINE' ? "default" : "outline"}
                onClick={() => handleTeachingModeChange('ONLINE')}
                className={`text-sm ${teachingMode === 'ONLINE' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border-border hover:bg-muted'}`}
                disabled={loading}
              >
                <Video className="w-4 h-4 mr-1" />
                Online
              </Button>
              <Button
                variant={teachingMode === 'OFFLINE' ? "default" : "outline"}
                onClick={() => handleTeachingModeChange('OFFLINE')}
                className={`text-sm ${teachingMode === 'OFFLINE' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'border-border hover:bg-muted'}`}
                disabled={loading}
              >
                <Users className="w-4 h-4 mr-1" />
                In-person
              </Button>
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {(subjects.length > 0 || teachingMode) && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              <X className="w-4 h-4 mr-1" />
              Clear all filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TutorFiltersComponent;