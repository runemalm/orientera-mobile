
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
      className="px-2 py-1.5 bg-white rounded border border-gray-100 shadow-sm hover:shadow transition-shadow cursor-pointer"
    >
      <div className="text-sm font-medium line-clamp-1">{competition.name}</div>
      <div className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
        <MapPin size={10} className="text-forest shrink-0" />
        <span className="line-clamp-1">{competition.club}</span>
      </div>
    </div>
  );
};

export default CalendarCompetitionItem;
