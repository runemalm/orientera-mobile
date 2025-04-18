import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionCard from '../components/CompetitionCard';
import { MapPin, Loader2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserLocation } from '../hooks/useUserLocation';
import { CompetitionSummary } from '../types';
import { getNearbyCompetitions } from '../services/api';
import { addMonths } from 'date-fns';
import PullToRefresh from '../components/PullToRefresh';
import { toast } from '@/hooks/use-toast';
import { calculateDistance } from '../utils/distanceUtils';
import { toSwedishTime } from '../utils/dateUtils';

const CompetitionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userLocation, isLoading: isLoadingLocation } = useUserLocation();
  const [competitions, setCompetitions] = useState<CompetitionSummary[]>([]);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetitions = useCallback(async () => {
    if (!userLocation) return;
    
    setIsLoadingCompetitions(true);
    setError(null);
    
    try {
      const today = new Date();
      const twoMonthsLater = addMonths(today, 2);
      
      const result = await getNearbyCompetitions(
        userLocation.latitude, 
        userLocation.longitude,
        {
          from: today,
          to: twoMonthsLater,
          limit: 50
        }
      );
      
      const sortedCompetitions = [...result].sort((a, b) => {
        const dateA = toSwedishTime(a.date);
        const dateB = toSwedishTime(b.date);
        const dateComparison = dateA.getTime() - dateB.getTime();
        
        if (dateComparison === 0) {
          const distanceA = calculateDistance(
            userLocation.latitude, 
            userLocation.longitude, 
            a.latitude, 
            a.longitude
          );
          
          const distanceB = calculateDistance(
            userLocation.latitude, 
            userLocation.longitude, 
            b.latitude, 
            b.longitude
          );
          
          return distanceA - distanceB;
        }
        
        return dateComparison;
      });
      
      setCompetitions(sortedCompetitions);
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setError('Det gick inte att hämta tävlingar. Försök igen senare.');
    } finally {
      setIsLoadingCompetitions(false);
    }
  }, [userLocation]);

  useEffect(() => {
    if (userLocation) {
      fetchCompetitions();
    }
  }, [userLocation, fetchCompetitions]);

  const handleRefresh = async () => {
    try {
      await fetchCompetitions();
      toast({
        title: "Uppdaterad",
        description: "Listan med tävlingar har uppdaterats",
        duration: 2000
      });
    } catch (error) {
      console.error("Error refreshing competitions:", error);
    }
  };

  const renderContent = () => {
    if (isLoadingLocation || isLoadingCompetitions) {
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
              onClick={() => navigate('/competitions/filters')}
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
      <div className="space-y-4">
        {competitions.length > 0 ? (
          <PullToRefresh onRefresh={handleRefresh}>
            <div className="space-y-3">
              {competitions.map(competition => (
                <CompetitionCard key={competition.id} competition={competition} />
              ))}
            </div>
          </PullToRefresh>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </div>
            <p className="text-gray-500">Inga tävlingar hittades</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <MobileLayout 
      title="Tävlingar i närheten" 
      action={
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/competitions/filters')}
          className="relative"
        >
          <Filter className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      }
    >
      <div className="mt-4 px-4">
        {renderContent()}
      </div>
    </MobileLayout>
  );
};

export default CompetitionsPage;
