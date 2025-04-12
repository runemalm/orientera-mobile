
import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionCard from '../components/CompetitionCard';
import { mockCompetitions } from '../utils/mockData';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import LocationInputForm from '../components/LocationInputForm';
import { useUserLocation } from '../hooks/useUserLocation';
import { Competition } from '../types';
import { format, addDays, startOfWeek, isSameDay, isSameMonth, subWeeks, isAfter, isBefore, startOfDay } from 'date-fns';

interface CompetitionWithDistance extends Omit<Competition, 'distance'> {
  distance: number;
}

const CompetitionsPage: React.FC = () => {
  const [showLocationDrawer, setShowLocationDrawer] = useState(false);
  const { userLocation, isLoading, updateUserLocation } = useUserLocation();

  const handleUpdateLocation = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setShowLocationDrawer(false);
  };

  const processCompetitionWithDistance = (competition: typeof mockCompetitions[0]): CompetitionWithDistance => {
    if (!userLocation) {
      return {
        ...competition,
        distance: 0
      };
    }
    
    return {
      ...competition,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        competition.coordinates.latitude,
        competition.coordinates.longitude
      )
    };
  };

  const getCompetitions = (): CompetitionWithDistance[] => {
    if (!userLocation || mockCompetitions.length === 0) return [];
    
    const processedCompetitions = mockCompetitions.map(processCompetitionWithDistance);
    const today = startOfDay(new Date());
    
    // Get Monday of the previous week
    const mondayLastWeek = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
    
    // Filter competitions from monday last week onwards
    const filteredCompetitions = processedCompetitions.filter(competition => {
      const competitionDate = new Date(competition.date);
      return isAfter(competitionDate, mondayLastWeek) || isSameDay(competitionDate, mondayLastWeek);
    });
    
    // Sort competitions by date
    return filteredCompetitions.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const renderContent = () => {
    if (isLoading) {
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
    
    const competitions = getCompetitions();
    
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
              onClick={() => setShowLocationDrawer(true)}
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
      
      <Drawer 
        open={showLocationDrawer} 
        onOpenChange={setShowLocationDrawer}
        modal={true}
      >
        <DrawerContent className="p-4 max-h-[90vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Byt plats</DrawerTitle>
          </DrawerHeader>
          <div className="pb-8">
            <LocationInputForm 
              onLocationSelected={handleUpdateLocation}
              onCancel={() => setShowLocationDrawer(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
};

export default CompetitionsPage;
