
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { useUserLocation } from '../hooks/useUserLocation';
import CompetitionsListView from '../components/competition/CompetitionsListView';
import { CompetitionSummary } from '../types';

const FavoritesPage: React.FC = () => {
  const { userLocation } = useUserLocation();
  const competitions: CompetitionSummary[] = []; // We'll use an empty array to start with

  return (
    <MobileLayout 
      title="Favoriter" 
      showBackButton
    >
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Favorittävlingar</h1>
        {userLocation && (
          <CompetitionsListView
            competitions={competitions}
            userLocation={userLocation}
            showFavorites={true}
          />
        )}
      </div>
    </MobileLayout>
  );
};

export default FavoritesPage;
