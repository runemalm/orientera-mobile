
import React, { useState, useEffect } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionList from '../components/competition/CompetitionList';
import { Star, Loader2 } from 'lucide-react';
import { CompetitionSummary } from '../types';
import { getCompetitionsByIds } from '../services/api';
import { toast } from 'sonner';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteCompetitions, setFavoriteCompetitions] = useState<CompetitionSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      
      // Get favorite IDs from localStorage
      const storedFavoritesStr = window.localStorage.getItem('favoriteCompetitions');
      let favoritesArray: string[] = [];
      
      if (storedFavoritesStr) {
        try {
          const parsed = JSON.parse(storedFavoritesStr);
          favoritesArray = Array.isArray(parsed) ? parsed : [];
          setFavorites(favoritesArray);
          
          // If we have favorites, fetch their data from API
          if (favoritesArray.length > 0) {
            try {
              const competitionsData = await getCompetitionsByIds(favoritesArray, true) as CompetitionSummary[];
              setFavoriteCompetitions(competitionsData);
              
              // Save to localStorage for offline access
              window.localStorage.setItem('savedCompetitions', JSON.stringify(competitionsData));
            } catch (error) {
              console.error('Error fetching favorite competitions:', error);
              toast.error('Kunde inte hämta dina favoriter');
              
              // Fallback to localStorage if API request fails
              const savedCompetitionsStr = window.localStorage.getItem('savedCompetitions');
              if (savedCompetitionsStr) {
                try {
                  const allSavedCompetitions: CompetitionSummary[] = JSON.parse(savedCompetitionsStr);
                  const favorites = allSavedCompetitions.filter(comp => 
                    favoritesArray.includes(comp.id)
                  );
                  setFavoriteCompetitions(favorites);
                } catch (err) {
                  console.error('Error parsing saved competitions:', err);
                  setFavoriteCompetitions([]);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error parsing favorites:', error);
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
      
      setIsLoading(false);
    };
    
    fetchFavorites();
  }, []);

  // Show loading while fetching
  if (isLoading) {
    return (
      <MobileLayout title="Favoriter">
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-gray-600">Laddar...</p>
        </div>
      </MobileLayout>
    );
  }

  if (favorites.length === 0 || favoriteCompetitions.length === 0) {
    return (
      <MobileLayout title="Favoriter">
        <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100 mx-4 mt-4">
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
      <div className="px-4 pt-4">
        <CompetitionList
          competitions={favoriteCompetitions}
          showFavorites={false}
        />
      </div>
    </MobileLayout>
  );
};

export default FavoritesPage;
