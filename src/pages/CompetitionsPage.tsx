
import React, { useState, useEffect } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionCard from '../components/CompetitionCard';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import LocationInputForm from '../components/LocationInputForm';
import { useUserLocation } from '../hooks/useUserLocation';
import { CompetitionSummary } from '../types';
import { getNearbyCompetitions } from '../services/api';
import { subDays, startOfDay, isAfter, isBefore, isSameDay, addMonths } from 'date-fns';

const CompetitionsPage: React.FC = () => {
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const { userLocation, isLoading: isLoadingLocation, updateUserLocation } = useUserLocation();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [competitions, setCompetitions] = useState<CompetitionSummary[]>([]);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleVisualViewportResize = () => {
        const newKeyboardVisible = window.visualViewport && 
          window.visualViewport.height < window.innerHeight * 0.75;
        setKeyboardVisible(newKeyboardVisible);
      };
      
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleVisualViewportResize);
        return () => {
          window.visualViewport.removeEventListener('resize', handleVisualViewportResize);
        };
      }
    }
  }, []);

  // Fetch competitions when location is updated
  useEffect(() => {
    const fetchCompetitions = async () => {
      if (!userLocation) return;
      
      setIsLoadingCompetitions(true);
      setError(null);
      
      try {
        // Get today's date and 3 months in the future for the date range
        const today = new Date();
        const threeMonthsLater = addMonths(today, 3);
        
        const result = await getNearbyCompetitions(
          userLocation.latitude, 
          userLocation.longitude,
          {
            from: today,
            to: threeMonthsLater,
            maxDistanceKm: 150, // Default max distance of 150km
            limit: 50 // Limit to 50 results
          }
        );
        
        // Sort by date
        const sortedCompetitions = result.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        setCompetitions(sortedCompetitions);
      } catch (err) {
        console.error('Error fetching competitions:', err);
        setError('Det gick inte att hämta tävlingar. Försök igen senare.');
      } finally {
        setIsLoadingCompetitions(false);
      }
    };
    
    fetchCompetitions();
  }, [userLocation]);

  const handleUpdateLocation = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setShowLocationSheet(false);
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
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-center mb-6">
              <MapPin size={32} className="text-forest mx-auto mb-2" />
              <h2 className="text-lg font-medium">Var befinner du dig?</h2>
              <p className="text-sm text-gray-500">För att visa tävlingar nära dig</p>
            </div>
            
            <LocationInputForm onLocationSelected={handleUpdateLocation} />
          </div>
        </div>
      );
    }
    
    const displayName = userLocation.city.length > 25 
      ? userLocation.city.split(',')[0]
      : userLocation.city;
    
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
            onClick={() => {
              if (userLocation) {
                setIsLoadingCompetitions(true);
                getNearbyCompetitions(userLocation.latitude, userLocation.longitude)
                  .then(data => setCompetitions(data))
                  .catch(() => setError('Det gick inte att hämta tävlingar. Försök igen senare.'))
                  .finally(() => setIsLoadingCompetitions(false));
              }
            }}
          >
            Försök igen
          </Button>
        </div>
      );
    }
    
    return (
      <>
        <div className="bg-gradient-to-br from-forest-light/30 to-forest-light/10 rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-forest/10 p-2 rounded-full">
                <MapPin size={18} className="text-forest" />
              </div>
              <div>
                <span className="font-medium text-sm line-clamp-1 text-forest-dark">{displayName}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="text-forest border-forest/30 hover:bg-forest/10"
              onClick={() => setShowLocationSheet(true)}
            >
              Byt plats
            </Button>
          </div>
        </div>
        
        {competitions.length > 0 ? (
          <div className="space-y-3">
            {competitions.map(competition => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
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
      </>
    );
  };

  return (
    <>
      <MobileLayout title="Tävlingar i närheten">
        <div className="mt-4">
          {renderContent()}
        </div>
      </MobileLayout>
      
      <Sheet 
        open={showLocationSheet} 
        onOpenChange={setShowLocationSheet}
        modal={true}
      >
        <SheetContent 
          side="bottom" 
          className={`p-4 max-h-[90vh] overflow-y-auto z-[100] ${keyboardVisible ? 'fixed bottom-0 pb-24' : ''}`}
        >
          <SheetHeader>
            <SheetTitle>Byt plats</SheetTitle>
          </SheetHeader>
          <div className="pb-8">
            <LocationInputForm 
              onLocationSelected={handleUpdateLocation}
              onCancel={() => setShowLocationSheet(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CompetitionsPage;
