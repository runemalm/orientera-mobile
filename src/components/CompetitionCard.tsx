
import React from 'react';
import { Competition } from '../types';
import { ChevronRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface CompetitionCardProps {
  competition: Competition;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/competition/${competition.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm mb-2 overflow-hidden border border-gray-100 cursor-pointer" 
      onClick={handleCardClick}
    >
      <div className="p-3 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 line-clamp-1">{competition.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm mr-1">{competition.club}</span>
          <span className="bg-location-light/20 text-location-dark px-2 py-1 rounded-full text-sm whitespace-nowrap">
            {competition.distance} km
          </span>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default CompetitionCard;
