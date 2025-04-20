
import React from 'react';
import { CompetitionSummary } from '../../types';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CalendarCompetitionItemProps {
  competition: CompetitionSummary;
}

const CalendarCompetitionItem: React.FC<CalendarCompetitionItemProps> = ({ competition }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/competition/${competition.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="px-2 py-1.5 bg-white rounded border border-gray-100 shadow-sm hover:shadow transition-shadow cursor-pointer flex items-center gap-2"
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{competition.name}</div>
      </div>
      <div className="text-xs text-gray-600 flex items-center gap-1 shrink-0">
        <MapPin size={10} className="text-forest shrink-0" />
        <span className="truncate max-w-[120px]">{competition.club}</span>
      </div>
    </div>
  );
};

export default CalendarCompetitionItem;
