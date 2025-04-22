
import React from 'react';
import { Competition } from '@/types';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { translateCompetitionType, translateDiscipline } from '@/utils/translations';
import { getDaysRemaining } from '@/utils/dateUtils';
import { Clock } from 'lucide-react';

interface CompetitionHeaderSectionProps {
  competition: Competition;
  isFavorite: boolean;
  toggleFavorite: (e: React.MouseEvent) => void;
}

const CompetitionHeaderSection: React.FC<CompetitionHeaderSectionProps> = ({ 
  competition, 
  isFavorite, 
  toggleFavorite 
}) => {
  const daysRemaining = getDaysRemaining(competition.date);
  
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
    <div className="bg-primary text-white p-5 rounded-lg shadow-md relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary-foreground/10"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-primary-foreground/10"></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <h2 className="text-xl font-bold">{competition.name}</h2>
          <p className="text-sm text-white/80">{competition.club}</p>
        </div>
        <button 
          onClick={toggleFavorite}
          className="p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
        >
          <Star
            size={24}
            className={cn(
              "transition-colors",
              isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white/80"
            )}
          />
        </button>
      </div>
      
      <div className="mt-3 flex items-center gap-2 relative z-10">
        <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm">
          <Clock size={14} />
          {status.text}
        </div>
        <div className="inline-flex bg-white/20 px-3 py-1 rounded-full text-sm">
          {translateCompetitionType(competition.competitionType)} • {translateDiscipline(competition.discipline)}
        </div>
      </div>
    </div>
  );
};

export default CompetitionHeaderSection;
