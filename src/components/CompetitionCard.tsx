
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
      className="bg-white rounded-lg shadow-md mb-4 overflow-hidden" 
      onClick={handleCardClick}
    >
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{competition.name}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <Calendar size={16} className="mr-1" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin size={16} className="mr-1" />
          <span>{competition.location}</span>
          <span className="ml-auto text-primary font-medium">{competition.distance} km bort</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <Award size={16} className="mr-1" />
          <span>{competition.competitionType} | {competition.district}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {competition.disciplines.map((discipline, index) => (
            <span 
              key={index}
              className="bg-forest-light/20 text-forest-dark px-2 py-1 rounded-full text-xs"
            >
              {discipline}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{competition.club}</span>
          <button className="bg-primary text-white text-sm font-medium py-1 px-3 rounded">
            Visa detaljer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompetitionCard;
