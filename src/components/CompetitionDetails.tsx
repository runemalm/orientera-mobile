
import React, { useState, useEffect } from 'react';
import { Competition } from '../types';
import CompetitionHeaderSection from './competition/sections/CompetitionHeaderSection';
import CompetitionInfoSection from './competition/sections/CompetitionInfoSection';
import CompetitionParticipantsSection from './competition/sections/CompetitionParticipantsSection';
import CompetitionLinksSection from './competition/sections/CompetitionLinksSection';
import CompetitionResultsSection from './competition/sections/CompetitionResultsSection';

interface CompetitionDetailsProps {
  competition: Competition;
}

const CompetitionDetails: React.FC<CompetitionDetailsProps> = ({ competition }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const storedFavoritesStr = window.localStorage.getItem('favoriteCompetitions');
    if (storedFavoritesStr) {
      try {
        const storedFavorites = JSON.parse(storedFavoritesStr);
        if (Array.isArray(storedFavorites)) {
          setIsFavorite(storedFavorites.includes(competition.id));
        }
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }
  }, [competition.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const storedFavoritesStr = window.localStorage.getItem('favoriteCompetitions');
    let currentFavorites: string[] = [];
    
    if (storedFavoritesStr) {
      try {
        const parsed = JSON.parse(storedFavoritesStr);
        currentFavorites = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Error parsing favorites:', error);
      }
    }
    
    let newFavorites: string[];
    
    if (isFavorite) {
      newFavorites = currentFavorites.filter(id => id !== competition.id);
    } else {
      newFavorites = [...currentFavorites, competition.id];
    }
    
    window.localStorage.setItem('favoriteCompetitions', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="space-y-6">
      <CompetitionHeaderSection
        competition={competition}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
      />
      
      <CompetitionInfoSection competition={competition} />
      
      <CompetitionParticipantsSection competition={competition} />
      
      <CompetitionLinksSection competition={competition} />
      
      <CompetitionResultsSection competition={competition} />
    </div>
  );
};

export default CompetitionDetails;
