
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { useUserLocation } from '../hooks/useUserLocation';
import { useLocalStorage } from '../hooks/useLocalStorage';
import CompetitionList from '../components/competition/CompetitionList';
import { Star } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const { userLocation } = useUserLocation();
  const [competitions] = useLocalStorage('competitions', []);
  const [favorites] = useLocalStorage<string[]>('favoriteCompetitions', []);

  if (favorites.length === 0) {
    return (
      <MobileLayout title="Favoriter">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Star className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">Inga favorittävlingar än</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Favoriter">
      <div className="px-4 py-4">
        <CompetitionList
          competitions={competitions}
          userLocation={userLocation}
          showFavorites={true}
        />
      </div>
    </MobileLayout>
  );
};

export default FavoritesPage;
