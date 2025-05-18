
import React, { useState, useEffect } from 'react';
import { Star, Calendar } from 'lucide-react';
import { CompetitionSummary } from '../../types';
import CompetitionCard from '../CompetitionCard';

interface CompetitionListProps {
  competitions: CompetitionSummary[];
  showFavorites?: boolean;
}

const CompetitionList: React.FC<CompetitionListProps> = ({ 
  competitions, 
  showFavorites = false 
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  
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
    }
  }, []);

  // Only filter by favorites if showFavorites is true, otherwise show all competitions passed in
  const filteredCompetitions = showFavorites
    ? competitions.filter(comp => favorites.includes(comp.id))
    : competitions;
    
  if (filteredCompetitions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          {showFavorites ? (
            <Star className="w-12 h-12 mx-auto" />
          ) : (
            <Calendar className="w-12 h-12 mx-auto" />
          )}
        </div>
        <p className="text-gray-500">
          {showFavorites ? 'Inga favorittävlingar än' : 'Inga tävlingar hittades'}
        </p>
        {!showFavorites && (
          <p className="text-sm text-gray-400 mt-2">
            Prova att justera filtersättningarna eller utöka sökområdet
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-1">
      {filteredCompetitions.map(competition => (
        <CompetitionCard 
          key={competition.id} 
          competition={competition}
        />
      ))}
    </div>
  );
};

export default CompetitionList;
