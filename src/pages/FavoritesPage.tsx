
import React, { useState, useEffect } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { useUserLocation } from '../hooks/useUserLocation';
import CompetitionList from '../components/competition/CompetitionList';
import { Star } from 'lucide-react';
import { CompetitionSummary } from '../types';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { userLocation } = useUserLocation();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteCompetitions, setFavoriteCompetitions] = useState<CompetitionSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load favorites and favorite competition data directly from localStorage
  useEffect(() => {
    // Get favorite IDs
    const storedFavoritesStr = window.localStorage.getItem('favoriteCompetitions');
    let favoritesArray: string[] = [];
    
    if (storedFavoritesStr) {
      try {
        const parsed = JSON.parse(storedFavoritesStr);
        favoritesArray = Array.isArray(parsed) ? parsed : [];
        setFavorites(favoritesArray);
      } catch (error) {
        console.error('Error parsing favorites:', error);
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }

    // Get saved competition data from localStorage
    const savedCompetitionsStr = window.localStorage.getItem('savedCompetitions');
    if (savedCompetitionsStr && favoritesArray.length > 0) {
      try {
        const allSavedCompetitions: CompetitionSummary[] = JSON.parse(savedCompetitionsStr);
        // Filter out only favorites
        const favorites = allSavedCompetitions.filter(comp => 
          favoritesArray.includes(comp.id)
        );
        setFavoriteCompetitions(favorites);
      } catch (error) {
        console.error('Error parsing saved competitions:', error);
        setFavoriteCompetitions([]);
      }
    } else {
      setFavoriteCompetitions([]);
    }
    
    setIsLoading(false);
  }, []);

  console.log('FavoritesPage - Favorites IDs:', favorites);
  console.log('FavoritesPage - Filtered favorites count:', favoriteCompetitions.length);

  const handleBack = () => {
    navigate('/profile');
  };

  // Show loading while fetching from localStorage (very brief)
  if (isLoading) {
    return (
      <MobileLayout title="Favoriter" showBackButton={true}>
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <p className="text-gray-600">Laddar...</p>
        </div>
      </MobileLayout>
    );
  }

  if (favorites.length === 0 || favoriteCompetitions.length === 0) {
    return (
      <MobileLayout title="Favoriter" showBackButton={true}>
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
    <MobileLayout title="Favoriter" showBackButton={true}>
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
