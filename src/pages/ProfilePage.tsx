
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionList from '../components/competition/CompetitionList';
import { CompetitionSummary } from '../types';

const ProfilePage: React.FC = () => {
  const [favoriteCompetitions, setFavoriteCompetitions] = useState<CompetitionSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load favorites from localStorage
  useEffect(() => {
    // Get favorite IDs
    const storedFavoritesStr = window.localStorage.getItem('favoriteCompetitions');
    let favoriteIds: string[] = [];
    
    if (storedFavoritesStr) {
      try {
        const parsed = JSON.parse(storedFavoritesStr);
        favoriteIds = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Error parsing favorites:', error);
      }
    }

    // Get saved competition data from localStorage
    const savedCompetitionsStr = window.localStorage.getItem('savedCompetitions');
    if (savedCompetitionsStr && favoriteIds.length > 0) {
      try {
        const allSavedCompetitions: CompetitionSummary[] = JSON.parse(savedCompetitionsStr);
        // Filter out only favorites
        const favorites = allSavedCompetitions.filter(comp => 
          favoriteIds.includes(comp.id)
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

  // Show loading while fetching from localStorage
  if (isLoading) {
    return (
      <MobileLayout title="Min profil">
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <p className="text-gray-600">Laddar...</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Min profil">
      <div className="px-4 pt-2">
        <h2 className="text-xl font-semibold mb-4">Mina favoriter</h2>
        
        {favoriteCompetitions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Star className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500">Inga favorittävlingar än</p>
          </div>
        ) : (
          <CompetitionList
            competitions={favoriteCompetitions}
            showFavorites={false}
          />
        )}
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
