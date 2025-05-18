import React, { useState, useEffect } from 'react';
import { CompetitionSummary } from '@/types';
import CompetitionList from './CompetitionList';
import { Star, Loader2 } from 'lucide-react';
import { getCompetitionsByIds } from '@/services/api';
import { toast } from 'sonner';

interface CompetitionPageFavoritesProps {
  competitions: CompetitionSummary[];
}

const CompetitionPageFavorites: React.FC<CompetitionPageFavoritesProps> = ({ competitions }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteCompetitions, setFavoriteCompetitions] = useState<CompetitionSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      const storedFavoritesStr = window.localStorage.getItem('favoriteCompetitions');
      
      if (storedFavoritesStr) {
        try {
          const parsed = JSON.parse(storedFavoritesStr);
          const favoriteIds = Array.isArray(parsed) ? parsed : [];
          setFavorites(favoriteIds);
          
          if (favoriteIds.length > 0) {
            // First try to find favorites in the passed competitions prop
            const foundInProps = competitions.filter(comp => 
              favoriteIds.includes(comp.id)
            );
            
            if (foundInProps.length === favoriteIds.length) {
              // If all favorites were in the props, use them
              setFavoriteCompetitions(foundInProps);
            } else {
              // Otherwise fetch from the API
              try {
                const fetchedCompetitions = await getCompetitionsByIds(favoriteIds, true) as CompetitionSummary[];
                setFavoriteCompetitions(fetchedCompetitions);
              } catch (error) {
                console.error('Error fetching favorites:', error);
                toast.error('Kunde inte hämta dina favoriter');
                
                // Fallback to what we have in props if API fails
                setFavoriteCompetitions(foundInProps);
              }
            }
          }
        } catch (error) {
          console.error('Error parsing favorites:', error);
          setFavorites([]);
        }
      }
      
      setIsLoading(false);
    };
    
    fetchFavorites();
  }, [competitions]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-8">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
        <p className="text-gray-500">Laddar...</p>
      </div>
    );
  }

  if (favoriteCompetitions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <Star className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-gray-500">Inga favorittävlingar än</p>
      </div>
    );
  }

  return (
    <div className="px-0">
      <CompetitionList
        competitions={favoriteCompetitions}
        showFavorites={false}
      />
    </div>
  );
};

export default CompetitionPageFavorites;
