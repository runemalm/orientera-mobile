
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionCard from '../components/CompetitionCard';
import { MapPin, Loader2, Filter, Building, CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

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
          onClick={() => setFilterSheetOpen(true)}
          className="relative"
        >
          <Filter className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      }
    >
      <div className="mt-4 px-4">
        {renderContent()}
      </div>

      <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0">
          <SheetHeader className="h-[3.5rem] flex flex-row items-center px-4 border-b">
            <SheetTitle className="flex-1 text-center">Filter</SheetTitle>
          </SheetHeader>
          <div className="p-4 space-y-4">
            <div 
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4"
              role="region"
              aria-label="Location filter"
            >
              <div className="flex items-center gap-2 text-forest">
                <MapPin className="h-5 w-5" />
                <h2 className="font-semibold">Plats</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{userLocation?.city}</span>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/competitions/filters')}
                    className="text-forest hover:text-forest-dark border-forest hover:border-forest-dark"
                  >
                    Byt plats
                  </Button>
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4"
              role="region"
              aria-label="Club filter"
            >
              <div className="flex items-center gap-2 text-forest">
                <Building className="h-5 w-5" />
                <h2 className="font-semibold">Klubb</h2>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left text-sm text-muted-foreground"
                onClick={() => {}}
              >
                Välj klubbar
              </Button>
            </div>

            <div 
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4"
              role="region"
              aria-label="Date filter"
            >
              <div className="flex items-center gap-2 text-forest">
                <CalendarRange className="h-5 w-5" />
                <h2 className="font-semibold">Datum</h2>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left text-sm text-muted-foreground"
                onClick={() => {}}
              >
                Välj datum
              </Button>
            </div>

            <Button 
              className="w-full bg-forest hover:bg-forest-dark mt-4"
              onClick={() => setFilterSheetOpen(false)}
            >
              Visa tävlingar
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </MobileLayout>
  );
};

export default CompetitionsPage;
