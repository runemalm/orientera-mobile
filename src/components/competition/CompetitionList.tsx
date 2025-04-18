
import React from 'react';
import { CompetitionSummary } from '../../types';
import CompetitionCard from '../CompetitionCard';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { UserLocation } from '../../hooks/useUserLocation';

interface CompetitionListProps {
  competitions: CompetitionSummary[];
  userLocation: UserLocation;
  showFavorites?: boolean;
}

const CompetitionList: React.FC<CompetitionListProps> = ({ 
  competitions, 
  userLocation,
  showFavorites = false 
}) => {
  const [favorites] = useLocalStorage<string[]>('favoriteCompetitions', []);

  const filteredCompetitions = showFavorites
    ? competitions.filter(comp => favorites?.includes(comp.id))
    : competitions;

  if (filteredCompetitions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <Star className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-gray-500">
          {showFavorites ? 'Inga favorittävlingar än' : 'Inga tävlingar hittades'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredCompetitions.map(competition => (
        <CompetitionCard 
          key={competition.id} 
          competition={competition}
          userLocation={userLocation}
        />
      ))}
    </div>
  );
};

export default CompetitionList;
