
import React from 'react';
import { Star } from 'lucide-react';
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
  
  // Safety check - ensure favorites is array
  const safetyFavorites = Array.isArray(favorites) ? favorites : [];

  // Only filter by favorites if showFavorites is true, otherwise show all competitions passed in
  const filteredCompetitions = showFavorites
    ? competitions.filter(comp => safetyFavorites.includes(comp.id))
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
