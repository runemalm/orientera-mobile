
import React, { useState, useEffect, useCallback } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { useUserLocation } from '../hooks/useUserLocation';
import { useLocalStorage } from '../hooks/useLocalStorage';
import CompetitionList from '../components/competition/CompetitionList';
import { Star, Loader2 } from 'lucide-react';
import { CompetitionSummary } from '../types';
import { getNearbyCompetitions } from '../services/api';

const FavoritesPage: React.FC = () => {
  const { userLocation } = useUserLocation();
  const [favorites] = useLocalStorage<string[]>('favoriteCompetitions', []);
  const [competitions, setCompetitions] = useState<CompetitionSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch competitions with specific date range
  const fetchCompetitions = useCallback(async () => {
    if (!userLocation) return;
    
    setIsLoading(true);
    setError(null);
    
    // Set date range: 20 days back and 3 months forward
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 20); // 20 days back
    
    const toDate = new Date();
    toDate.setMonth(toDate.getMonth() + 3); // 3 months ahead
    
    try {
      const result = await getNearbyCompetitions(
        userLocation.latitude, 
        userLocation.longitude,
        {
          from: fromDate,
          to: toDate,
          limit: 100
        }
      );
      
      setCompetitions(result);
    } catch (err) {
      console.error('Error fetching competitions for favorites:', err);
      setError('Det gick inte att hämta tävlingar. Försök igen senare.');
    } finally {
      setIsLoading(false);
    }
  }, [userLocation]);

  // Fetch competitions when component mounts
  useEffect(() => {
    if (userLocation) {
      fetchCompetitions();
    }
  }, [userLocation, fetchCompetitions]);

  // Filter competitions to only include favorited ones
  const favoriteCompetitions = competitions.filter(comp => 
    Array.isArray(favorites) && favorites.includes(comp.id)
  );

  // Debug output
  console.log('FavoritesPage - Favorites IDs:', favorites);
  console.log('FavoritesPage - All competitions count:', competitions.length);
  console.log('FavoritesPage - Filtered favorites count:', favoriteCompetitions.length);

  // Show loader when fetching
  if (isLoading) {
    return (
      <MobileLayout title="Favoriter">
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-gray-600">Laddar...</p>
        </div>
      </MobileLayout>
    );
  }

  // Show error message
  if (error) {
    return (
      <MobileLayout title="Favoriter">
        <div className="text-center py-8">
          <p className="text-gray-500">{error}</p>
        </div>
      </MobileLayout>
    );
  }

  // Show empty state if no favorites
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
      <div className="px-4 pb-20">
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
