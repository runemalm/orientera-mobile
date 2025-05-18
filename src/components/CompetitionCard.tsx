
import React, { useState, useEffect } from 'react';
import { CompetitionSummary } from '../types';
import { Clock, MapPin, Navigation, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getDaysRemaining } from '../utils/dateUtils';
import { calculateDistance, formatDistance } from '../utils/distanceUtils';

interface CompetitionCardProps {
  competition: CompetitionSummary;
  userLocation?: { latitude: number | null; longitude: number | null };
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ 
  competition, 
  userLocation 
}) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Load favorite status on mount
  useEffect(() => {
    const storedFavoritesStr = window.localStorage.getItem('favoriteCompetitions');
    if (storedFavoritesStr) {
      try {
        const storedFavorites = JSON.parse(storedFavoritesStr);
        if (Array.isArray(storedFavorites)) {
          setIsFavorite(storedFavorites.includes(competition.id));
        }
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }
  }, [competition.id]);
  
  const handleCardClick = () => {
    navigate(`/competition/${competition.id}`);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Get current favorites directly from localStorage
    const storedFavoritesStr = window.localStorage.getItem('favoriteCompetitions');
    let currentFavorites: string[] = [];
    
    if (storedFavoritesStr) {
      try {
        const parsed = JSON.parse(storedFavoritesStr);
        currentFavorites = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Error parsing favorites:', error);
      }
    }
    
    let newFavorites: string[];
    
    if (isFavorite) {
      // Remove from favorites
      newFavorites = currentFavorites.filter(id => id !== competition.id);
    } else {
      // Add to favorites
      newFavorites = [...currentFavorites, competition.id];
    }
    
    console.log('Toggling favorite:', {
      competitionId: competition.id,
      wasInFavorites: isFavorite,
      oldFavorites: currentFavorites,
      newFavorites: newFavorites
    });
    
    // Update localStorage
    window.localStorage.setItem('favoriteCompetitions', JSON.stringify(newFavorites));
    
    // Update local state
    setIsFavorite(!isFavorite);
  };

  const daysRemaining = getDaysRemaining(competition.date);
  
  // Handle distance calculation differently if userLocation is not provided
  const distance = userLocation ? calculateDistance(
    userLocation.latitude || null,
    userLocation.longitude || null,
    competition.latitude,
    competition.longitude
  ) : null;

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
              {distance !== null && (
                <Badge variant="outline" className="bg-forest-light/20 text-forest-dark px-3 py-1 gap-1 font-medium border-0">
                  <Navigation size={14} />
                  {formatDistance(distance)}
                </Badge>
              )}

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
