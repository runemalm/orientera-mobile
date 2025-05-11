
import React, { useState, useEffect } from 'react';
import { Star, UserRound } from 'lucide-react';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionList from '../components/competition/CompetitionList';
import { CompetitionSummary } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

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
      <div className="px-4 pt-2 pb-6">
        {/* Profile Card */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src="/placeholder.svg" alt="Profilbild" />
                <AvatarFallback className="bg-primary/10 text-forest">
                  <UserRound className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">Gäst</h2>
                <p className="text-sm text-muted-foreground">Inloggning kommer snart</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Favorites Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Star className="text-yellow-500 w-5 h-5" />
            <h2 className="text-xl font-semibold">Mina favoriter</h2>
          </div>
          
          {favoriteCompetitions.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100">
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
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
