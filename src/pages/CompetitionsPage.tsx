import React, { useState, useEffect, useCallback, useRef } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Loader2 } from 'lucide-react';
import { useUserLocation } from '../hooks/useUserLocation';
import { CompetitionSummary } from '../types';
import { getNearbyCompetitions } from '../services/api';
import CompetitionList from '../components/competition/CompetitionList';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Store competitions in memory to persist between navigations
let cachedCompetitions: CompetitionSummary[] = [];

const CompetitionsPage: React.FC = () => {
  const { userLocation } = useUserLocation();
  const [competitions, setCompetitions] = useState<CompetitionSummary[]>(cachedCompetitions);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(cachedCompetitions.length === 0);
  const [error, setError] = useState<string | null>(null);
  const initialFetchCompleted = useRef(false);
  const [daysBack] = useLocalStorage<number>('competitionsDaysBack', 1);

  const fetchCompetitions = useCallback(async () => {
    if (!userLocation) return;
    
    setIsLoadingCompetitions(true);
    setError(null);
    
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysBack); // Use daysBack setting
    
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
      cachedCompetitions = result;
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setError('Det gick inte att hämta tävlingar. Försök igen senare.');
    } finally {
      setIsLoadingCompetitions(false);
    }
  }, [userLocation, daysBack]);

  useEffect(() => {
    if (userLocation && (!initialFetchCompleted.current || cachedCompetitions.length === 0)) {
      fetchCompetitions();
      initialFetchCompleted.current = true;
    }
  }, [userLocation, fetchCompetitions]);

  const renderContent = () => {
    if (isLoadingCompetitions && competitions.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-gray-600">Laddar...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">{error}</p>
        </div>
      );
    }

    return (
      <div className="px-4 py-4">
        <CompetitionList 
          competitions={competitions} 
          userLocation={userLocation}
          showFavorites={false}
        />
      </div>
    );
  };

  return (
    <MobileLayout title="Tävlingar nära dig">
      <div className="h-full">
        {renderContent()}
      </div>
    </MobileLayout>
  );
};

export default CompetitionsPage;
