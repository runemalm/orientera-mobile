
import React, { useState, useEffect } from 'react';
import { CompetitionSummary } from '../../types';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CalendarCompetitionItemProps {
  competition: CompetitionSummary;
  className?: string;
}

const CalendarCompetitionItem: React.FC<CalendarCompetitionItemProps> = ({ 
  competition,
  className = '' 
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
  
  const handleClick = () => {
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
    
    // Update localStorage
    window.localStorage.setItem('favoriteCompetitions', JSON.stringify(newFavorites));
    
    // Update local state
    setIsFavorite(!isFavorite);
  };

  return (
    <div 
      onClick={handleClick}
      className={`px-2 py-1.5 rounded border border-gray-100/50 transition-all cursor-pointer flex items-center gap-2 w-full ${className}`}
    >
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="text-sm font-medium text-gray-700 truncate">{competition.name}</div>
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-1 shrink-0 w-[100px] max-w-[100px]">
        <span className="truncate">{competition.club}</span>
      </div>
      <button 
        onClick={toggleFavorite}
        className="p-1 rounded-full transition-colors shrink-0"
        aria-label={isFavorite ? "Ta bort från favoriter" : "Lägg till i favoriter"}
      >
        <Star
          size={16}
          className={cn(
            "transition-colors",
            isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
          )}
        />
      </button>
    </div>
  );
};

export default CalendarCompetitionItem;
