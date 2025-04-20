
import React from 'react';
import { CompetitionSummary } from '../types';
import { Clock, MapPin, Navigation, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getDaysRemaining } from '../utils/dateUtils';
import { calculateDistance, formatDistance } from '../utils/distanceUtils';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface CompetitionCardProps {
  competition: CompetitionSummary;
  userLocation: { latitude: number | null; longitude: number | null };
  compact?: boolean;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ 
  competition, 
  userLocation,
  compact = false 
}) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useLocalStorage<string[]>('favoriteCompetitions', []);
  
  const handleCardClick = () => {
    navigate(`/competition/${competition.id}`);
  };

  // Ensure favorites is always an array
  const safetyFavorites = Array.isArray(favorites) ? [...favorites] : [];
  const isFavorite = safetyFavorites.includes(competition.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Get the current favorites directly from localStorage to ensure we have the most up-to-date list
    const storedFavoritesString = window.localStorage.getItem('favoriteCompetitions');
    // Parse stored favorites or default to empty array if null/invalid
    const currentFavorites = storedFavoritesString ? 
      (JSON.parse(storedFavoritesString) || []) : 
      [];
    
    // Ensure we're working with an array
    const safeCurrentFavorites = Array.isArray(currentFavorites) ? currentFavorites : [];
    
    let newFavorites: string[];
    const isCurrentlyFavorite = safeCurrentFavorites.includes(competition.id);
    
    if (isCurrentlyFavorite) {
      newFavorites = safeCurrentFavorites.filter(id => id !== competition.id);
    } else {
      newFavorites = [...safeCurrentFavorites, competition.id];
    }
    
    console.log('Toggling favorite:', {
      competitionId: competition.id,
      wasInFavorites: isCurrentlyFavorite,
      oldFavorites: safeCurrentFavorites,
      newFavorites: newFavorites
    });
    
    // Update localStorage and state
    setFavorites(newFavorites);
  };

  const daysRemaining = getDaysRemaining(competition.date);
  const distance = calculateDistance(
    userLocation?.latitude || null,
    userLocation?.longitude || null,
    competition.latitude,
    competition.longitude
  );

  const getStatusInfo = () => {
    if (daysRemaining > 7) {
      return { 
        color: "bg-gray-100 text-gray-700",
        text: `${daysRemaining} dagar kvar`
      };
    } else if (daysRemaining > 1) {
      return {
        color: "bg-blue-100 text-blue-700", 
        text: `${daysRemaining} dagar kvar`
      };
    } else if (daysRemaining === 1) {
      return {
        color: "bg-blue-200 text-blue-800",
        text: "Imorgon"
      };
    } else if (daysRemaining === 0) {
      return {
        color: "bg-green-100 text-green-700",
        text: "Idag"
      };
    } else {
      const daysSince = Math.abs(daysRemaining);
      const daysText = daysSince === 1 ? "dag" : "dagar";
      return {
        color: "bg-gray-100 text-gray-500",
        text: `${daysSince} ${daysText} sedan`
      };
    }
  };

  const status = getStatusInfo();

  // Adjust layout based on compact prop
  if (compact) {
    return (
      <div 
        className="bg-white border border-gray-100 rounded p-2 cursor-pointer hover:shadow-sm transition-shadow" 
        onClick={handleCardClick}
      >
        <div className="flex items-center gap-2">
          <div className="flex-grow">
            <div className="font-medium text-sm line-clamp-1">{competition.name}</div>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <MapPin size={10} className="text-forest" />
              <span className="line-clamp-1">{competition.club}</span>
            </div>
          </div>
          <button 
            onClick={toggleFavorite}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Star
              size={14}
              className={cn(
                "transition-colors",
                isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
              )}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Card 
      className="bg-white shadow-sm overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md transition-shadow" 
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="outline" className={cn("px-3 py-1 gap-1 font-medium", status.color)}>
              <Clock size={14} />
              {status.text}
            </Badge>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-forest-light/20 text-forest-dark px-3 py-1 gap-1 font-medium border-0">
                <Navigation size={14} />
                {formatDistance(distance)}
              </Badge>

              <button 
                onClick={toggleFavorite}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={isFavorite ? "Ta bort från favoriter" : "Lägg till i favoriter"}
              >
                <Star
                  size={20}
                  className={cn(
                    "transition-colors",
                    isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                  )}
                />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <h3 className="font-medium text-gray-800 text-lg">{competition.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin size={14} className="text-forest" />
              <span className="line-clamp-1">{competition.club}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitionCard;
