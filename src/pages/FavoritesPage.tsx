
import React, { useEffect, useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { useUserLocation } from '../hooks/useUserLocation';
import { useLocalStorage } from '../hooks/useLocalStorage';
import CompetitionList from '../components/competition/CompetitionList';
import { Star } from 'lucide-react';
import { CompetitionSummary } from '../types';

const FavoritesPage: React.FC = () => {
  const { userLocation } = useUserLocation();
  const [competitions] = useLocalStorage<CompetitionSummary[]>('competitions', []);
  const [favorites] = useLocalStorage<string[]>('favoriteCompetitions', []);
  
  // Filter competitions to only include favorited ones
  const favoriteCompetitions = competitions.filter(comp => 
    Array.isArray(favorites) && favorites.includes(comp.id)
  );

  // Debug output
  console.log('FavoritesPage - Favorites IDs:', favorites);
  console.log('FavoritesPage - All competitions count:', competitions.length);
  console.log('FavoritesPage - Filtered favorites count:', favoriteCompetitions.length);

  if (favorites.length === 0 || favoriteCompetitions.length === 0) {
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
          competitions={favoriteCompetitions}
          userLocation={userLocation}
          showFavorites={false} // We're already filtered to favorites
        />
      </div>
    </MobileLayout>
  );
};

export default FavoritesPage;
