import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  MapPin, 
  Star, 
  Clock, 
  GraduationCap, 
  User, 
  Video,
  Users,
  MessageCircle,
  Heart
} from 'lucide-react';
import { Tutor } from '../hooks/useTutorListing';

interface TutorCardProps {
  tutor: Tutor;
  onContact?: (tutor: Tutor) => void;
  onSaveToFavorites?: (tutor: Tutor) => void;
}

const TutorCard: React.FC<TutorCardProps> = ({ 
  tutor, 
  onContact,
  onSaveToFavorites 
}) => {
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? 'Free' : `₹${numPrice}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleCardClick = () => {
    // Store tutor data in localStorage for the profile page
    // TODO: In future, use dedicated API endpoint `/api/tutor/{id}` instead
    localStorage.setItem(`tutor_${tutor.id}`, JSON.stringify(tutor));
    window.open(`/tutor/${tutor.id}`, '_blank');
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 border border-border bg-card hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 h-full cursor-pointer">
      <CardContent className="p-0 h-full flex flex-col" onClick={handleCardClick}>
        {/* Profile Picture - Takes 40% of card height */}
        <div className="relative h-48 bg-gradient-to-br from-primary/80 to-primary flex-shrink-0 overflow-hidden">
          {(tutor.profile_pic || tutor.profile_picture) ? (
            <img
              src={tutor.profile_pic || tutor.profile_picture}
              alt={tutor.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {tutor.name.charAt(0).toUpperCase()}
                </div>
                <User className="w-8 h-8 mx-auto opacity-60" />
              </div>
            </div>
          )}
          
          {/* Favorite button overlay */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSaveToFavorites?.(tutor);
            }}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 text-muted-foreground hover:text-destructive transition-colors shadow-sm"
          >
            <Heart className="w-4 h-4" />
          </button>

          {/* Teaching mode badge */}
          <div className="absolute bottom-3 left-3">
            <Badge 
              className={tutor.teaching_mode === 'ONLINE' 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-accent text-accent-foreground hover:bg-accent/90'
              }
            >
              {tutor.teaching_mode === 'ONLINE' ? (
                <>
                  <Video className="w-3 h-3 mr-1" />
                  Online
                </>
              ) : (
                <>
                  <Users className="w-3 h-3 mr-1" />
                  In-person
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Content Section - Takes remaining space */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 pb-3">
            <h3 className="text-lg font-semibold text-foreground mb-2 truncate group-hover:text-primary transition-colors">
              {tutor.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {renderStars(tutor.rating || 5)}
              </div>
              <span className="text-sm text-muted-foreground">
                {tutor.rating || 5}.0 ({tutor.total_reviews || 0})
              </span>
            </div>

            {/* Location */}
            {tutor.area && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{tutor.area}, {tutor.state}</span>
              </div>
            )}
          </div>

          {/* Subjects */}
          <div className="px-4 pb-3">
            <div className="flex flex-wrap gap-2">
              {tutor.subjects.slice(0, 3).map((subject, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                  {subject}
                </Badge>
              ))}
              {tutor.subjects.length > 3 && (
                <Badge variant="outline" className="text-xs text-muted-foreground border-muted-foreground/30">
                  +{tutor.subjects.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Experience & Education */}
          <div className="px-4 pb-4 space-y-2 text-sm text-muted-foreground flex-1">
            {tutor.experience_years && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{tutor.experience_years} years experience</span>
              </div>
            )}
            {tutor.degree && (
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="truncate">{tutor.degree}</span>
              </div>
            )}
          </div>

          {/* Footer - Price and Actions */}
          <div className="mt-auto p-4 pt-3 bg-muted/30 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-foreground">
                  {formatPrice(tutor.lesson_price || 0)}
                </div>
                <div className="text-xs text-muted-foreground">per hour</div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs px-3 text-muted-foreground hover:text-foreground hover:bg-background"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Store tutor data in localStorage for the profile page
                    // TODO: In future, use dedicated API endpoint `/api/tutor/{id}` instead
                    localStorage.setItem(`tutor_${tutor.id}`, JSON.stringify(tutor));
                    window.open(`/tutor/${tutor.id}`, '_blank');
                  }}
                >
                  View Profile
                </Button>
                <Button
                  size="sm"
                  className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    onContact?.(tutor);
                  }}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorCard;