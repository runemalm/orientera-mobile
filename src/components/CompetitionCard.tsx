
import React from 'react';
import { Competition } from '../types';
import { Calendar, MapPin, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompetitionCardProps {
  competition: Competition;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition }) => {
  const navigate = useNavigate();
  
  // Format date to be more readable - using Swedish format
  const formattedDate = new Date(competition.date).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  const handleCardClick = () => {
    navigate(`/competition/${competition.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm mb-3 overflow-hidden border border-gray-100" 
      onClick={handleCardClick}
    >
      <div className="p-3">
        <h3 className="font-bold text-base text-gray-800 mb-1">{competition.name}</h3>
        <div className="flex flex-wrap gap-2 items-center text-sm text-gray-700">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={14} className="mr-1" />
            <span>{competition.location}</span>
          </div>
          <div className="flex items-center">
            <Award size={14} className="mr-1" />
            <span>{competition.competitionType}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <span className="bg-forest-light/30 text-forest-dark px-2 py-1 rounded-full text-sm font-medium">
            {competition.discipline}
          </span>
          <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
            {competition.distance} km bort
          </span>
        </div>
      </div>
      <div className="bg-gray-50 px-3 py-2 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-700 font-medium">{competition.club}</span>
        <button className="bg-primary text-white text-sm font-medium py-1 px-3 rounded">
          Visa
        </button>
      </div>
    </div>
  );
};

export default CompetitionCard;
