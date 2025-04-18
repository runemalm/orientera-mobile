import React, { useState, useEffect, useCallback, useRef } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserLocation } from '../hooks/useUserLocation';
import { CompetitionSummary } from '../types';
import { getNearbyCompetitions } from '../services/api';
import { toast } from '@/hooks/use-toast';
import CompetitionList from '../components/competition/CompetitionList';
import CompetitionFilters from '../components/competition/CompetitionFilters';
import { ScrollArea } from '@/components/ui/scroll-area';

// Store competitions in memory to persist between navigations
let cachedCompetitions: CompetitionSummary[] = [];

const CompetitionsPage: React.FC = () => {
  const { userLocation, isLoading: isLoadingLocation } = useUserLocation();
  const [competitions, setCompetitions] = useState<CompetitionSummary[]>(cachedCompetitions);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(cachedCompetitions.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const initialFetchCompleted = useRef(false);

  const fetchCompetitions = useCallback(async () => {
    if (!userLocation) return;
    
    setIsLoadingCompetitions(true);
    setError(null);
    
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 1); // 1 day before today
    
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
      // Update the cache
      cachedCompetitions = result;
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setError('Det gick inte att hämta tävlingar. Försök igen senare.');
    } finally {
      setIsLoadingCompetitions(false);
    }
  }, [userLocation]);

  useEffect(() => {
    // Only fetch if we have location and haven't already done initial fetch or cache is empty
    if (userLocation && (!initialFetchCompleted.current || cachedCompetitions.length === 0)) {
      fetchCompetitions();
      initialFetchCompleted.current = true;
    }
  }, [userLocation, fetchCompetitions]);

  const handleApplyFilters = () => {
    setFilterDrawerOpen(false);
    fetchCompetitions();
  };

  const renderFilterSection = () => {
    return null;
  };

  const renderContent = () => {
    if (isLoadingLocation || (isLoadingCompetitions && competitions.length === 0)) {
      return (
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-gray-600">Laddar...</p>
        </div>
      );
    }

    if (!userLocation) {
      return (
        <div className="p-6">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <MapPin size={32} className="text-forest mx-auto mb-2" />
            <h2 className="text-lg font-medium mb-4">Sätt din plats för att se tävlingar</h2>
            <Button 
              onClick={() => setFilterDrawerOpen(true)}
              className="bg-forest hover:bg-forest-dark"
            >
              Välj plats
            </Button>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12" y2="16" />
            </svg>
          </div>
          <p className="text-gray-500">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => fetchCompetitions()}
          >
            Försök igen
          </Button>
        </div>
      );
    }

    return (
      <>
        {renderFilterSection()}
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="p-4">
            <CompetitionList 
              competitions={competitions} 
              userLocation={userLocation}
            />
          </div>
        </ScrollArea>
      </>
    );
  };

  return (
    <MobileLayout 
      title="Tävlingar nära dig"
    >
      <div className="mt-4">
        {renderContent()}
      </div>

      <CompetitionFilters
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        onApplyFilters={handleApplyFilters}
      />
    </MobileLayout>
  );
};

export default CompetitionsPage;
