
import React, { useState, useEffect, useCallback } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { useUserLocation } from '../hooks/useUserLocation';
import { useLocalStorage } from '../hooks/useLocalStorage';
import CompetitionList from '../components/competition/CompetitionList';
import { Star, Loader2 } from 'lucide-react';
import { CompetitionSummary } from '../types';
import { getNearbyCompetitions } from '../services/api';
import { ScrollArea } from '@/components/ui/scroll-area';

const FavoritesPage: React.FC = () => {
  const { userLocation } = useUserLocation();
  const [favorites, setFavorites] = useLocalStorage<string[]>('favoriteCompetitions', []);
  const [competitions, setCompetitions] = useState<CompetitionSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all competitions, then filter by favorites
  const fetchCompetitions = useCallback(async () => {
    if (!userLocation) return;
    
    setIsLoading(true);
    setError(null);
    
    // Same date range as CompetitionsPage
    const fromDate = new Date();
    const daysBack = 1; // Default to 1 day back
    fromDate.setDate(fromDate.getDate() - daysBack);
    
    const toDate = new Date();
    toDate.setMonth(toDate.getMonth() + 1); // 1 month ahead
    
    try {
      const result = await getNearbyCompetitions(
        userLocation.latitude, 
        userLocation.longitude,
        {
          from: fromDate,
          to: toDate,
          limit: 50
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

  // Listen for changes to localStorage favorites
  useEffect(() => {
    const handleStorageChange = () => {
      const storedFavoritesString = window.localStorage.getItem('favoriteCompetitions');
      if (storedFavoritesString) {
        try {
          const newFavorites = JSON.parse(storedFavoritesString);
          // Only update state if favorites have changed
          if (JSON.stringify(newFavorites) !== JSON.stringify(favorites)) {
            setFavorites(newFavorites);
          }
        } catch (e) {
          console.error('Error parsing favorites from localStorage:', e);
        }
      }
    };

    // Listen for storage events (when other tabs update localStorage)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [favorites, setFavorites]);

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
  if (!Array.isArray(favorites) || favorites.length === 0 || favoriteCompetitions.length === 0) {
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
      <ScrollArea className="h-[calc(100vh-7rem)] px-4 py-4">
        <CompetitionList
          competitions={favoriteCompetitions}
          userLocation={userLocation}
          showFavorites={false} // We're already filtered to favorites
          onFavoriteToggle={(id, isFavorite) => {
            // We don't need to trigger a fetch, just update the UI with current data
            if (!isFavorite) {
              // Remove from the list visually without reload or scrolling
              const updatedCompetitions = favoriteCompetitions.filter(comp => comp.id !== id);
              setCompetitions(prev => prev.filter(comp => comp.id !== id || favorites.includes(comp.id)));
            }
          }}
        />
      </ScrollArea>
    </MobileLayout>
  );
};

export default FavoritesPage;
