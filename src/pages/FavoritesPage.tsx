
import React, { useState, useEffect, useCallback } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { useUserLocation } from '../hooks/useUserLocation';
import CompetitionList from '../components/competition/CompetitionList';
import { Star, Loader2 } from 'lucide-react';
import { CompetitionSummary } from '../types';
import { getNearbyCompetitions } from '../services/api';

const FavoritesPage: React.FC = () => {
  const { userLocation } = useUserLocation();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load favorites directly from localStorage
  useEffect(() => {
    const storedFavoritesStr = window.localStorage.getItem('favoriteCompetitions');
    if (storedFavoritesStr) {
      try {
        const parsed = JSON.parse(storedFavoritesStr);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Error parsing favorites:', error);
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, []);

  const fetchCompetitions = useCallback(async () => {
    if (!userLocation) return;
    
    setIsLoading(true);
    setError(null);
    
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 20);
    
    const toDate = new Date();
    toDate.setMonth(toDate.getMonth() + 3);
    
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

  useEffect(() => {
    if (userLocation) {
      fetchCompetitions();
    }
  }, [userLocation, fetchCompetitions]);

  const favoriteCompetitions = competitions.filter(comp => 
    favorites.includes(comp.id)
  );

  console.log('FavoritesPage - Favorites IDs:', favorites);
  console.log('FavoritesPage - All competitions count:', competitions.length);
  console.log('FavoritesPage - Filtered favorites count:', favoriteCompetitions.length);

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

  if (error) {
    return (
      <MobileLayout title="Favoriter">
        <div className="text-center py-8">
          <p className="text-gray-500">{error}</p>
        </div>
      </MobileLayout>
    );
  }

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
      <div className="px-2 pt-4">
        <CompetitionList
          competitions={favoriteCompetitions}
          userLocation={userLocation}
          showFavorites={false}
        />
      </div>
    </MobileLayout>
  );
};

export default FavoritesPage;
