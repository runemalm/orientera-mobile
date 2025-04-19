
import React, { useMemo } from 'react';
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

  // Calculate filtered competitions with useMemo to prevent unnecessary recalculations
  const filteredCompetitions = useMemo(() => {
    // Debug output for favorites
    console.log('CompetitionList - Current favorites:', favorites);
    
    if (!showFavorites) return competitions;
    
    // Make sure we have valid favorites
    if (!Array.isArray(favorites)) {
      console.log('Favorites is not an array, returning empty list');
      return [];
    }
    
    // Filter competitions by favorites
    return competitions.filter(comp => {
      const isIncluded = favorites.includes(comp.id);
      console.log(`Competition ${comp.id} (${comp.name}) is${isIncluded ? '' : ' not'} in favorites`);
      return isIncluded;
    });
  }, [competitions, favorites, showFavorites]);
  
  console.log(`Showing ${filteredCompetitions.length} competitions in ${showFavorites ? 'favorites' : 'all'} tab`);

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
