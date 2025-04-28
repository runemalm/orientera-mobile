
import React from 'react';
import { CompetitionSummary } from '@/types';
import CompetitionList from './CompetitionList';
import { useUserLocation } from '@/hooks/useUserLocation';
import { Star } from 'lucide-react';

interface CompetitionPageFavoritesProps {
  competitions: CompetitionSummary[];
}

const CompetitionPageFavorites: React.FC<CompetitionPageFavoritesProps> = ({ competitions }) => {
  const { userLocation } = useUserLocation();
  const [favorites, setFavorites] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    const storedFavoritesStr = window.localStorage.getItem('favoriteCompetitions');
    if (storedFavoritesStr) {
      try {
        const parsed = JSON.parse(storedFavoritesStr);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Error parsing favorites:', error);
        setFavorites([]);
      }
    }
  }, []);

  const favoriteCompetitions = competitions.filter(comp => 
    favorites.includes(comp.id)
  );

  if (favoriteCompetitions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <Star className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-gray-500">Inga favorittävlingar än</p>
      </div>
    );
  }

  return (
    <div className="px-0">
      <CompetitionList
        competitions={favoriteCompetitions}
        userLocation={userLocation}
        showFavorites={false}
      />
    </div>
  );
};

export default CompetitionPageFavorites;
