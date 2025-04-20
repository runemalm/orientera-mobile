
import React from 'react';
import { CompetitionSummary } from '../../types';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
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
  const [favorites, setFavorites] = useLocalStorage<string[]>('favoriteCompetitions', []);
  
  const handleClick = () => {
    navigate(`/competition/${competition.id}`);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Ensure we always use the latest favorites from state
    const safeCurrentFavorites = Array.isArray(favorites) ? [...favorites] : [];
    const isFavorite = safeCurrentFavorites.includes(competition.id);
    
    const newFavorites = isFavorite
      ? safeCurrentFavorites.filter(id => id !== competition.id)
      : [...safeCurrentFavorites, competition.id];
    
    // Use the state updater function - this will trigger the useEffect in useLocalStorage
    setFavorites(newFavorites);
  };

  // Check favorite status directly from current state
  const isFavorite = Array.isArray(favorites) && favorites.includes(competition.id);

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
