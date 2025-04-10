
import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionCard from '../components/CompetitionCard';
import { mockCompetitions } from '../utils/mockData';
import { MapPin, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import LocationInputForm from '../components/LocationInputForm';
import { useUserLocation } from '../hooks/useUserLocation';

const CompetitionsPage: React.FC = () => {
  const [showLocationDrawer, setShowLocationDrawer] = useState(false);
  const [showResetDrawer, setShowResetDrawer] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const { userLocation, isFirstVisit, isLoading, updateUserLocation, resetUserLocation } = useUserLocation();

  const handleUpdateLocation = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setShowLocationDrawer(false);
  };
  
  const handleResetLocation = () => {
    resetUserLocation();
    setShowResetDrawer(false);
  };

  const handleTap = () => {
    setTapCount(prevCount => prevCount + 1);
    
    if (tapCount >= 2) {
      setShowResetDrawer(true);
      setTapCount(0);
    } else {
      // Reset after 2 seconds if not reached 3 taps
      setTimeout(() => {
        setTapCount(0);
      }, 2000);
    }
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
        <div className="space-y-6 py-6">
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="bg-gray-200 p-3 rounded-full w-14 h-14 mb-4 flex items-center justify-center">
                <MapPin size={28} className="text-gray-600" />
              </div>
              <h2 className="text-lg font-medium mb-2 text-gray-800 text-center">Välkommen!</h2>
              <p className="text-gray-600 mb-4 text-center">
                Ange din plats för att hitta orienteringstävlingar nära dig.
              </p>
              
              <div className="w-full">
                <LocationInputForm 
                  onLocationSelected={handleUpdateLocation}
                />
              </div>
              
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Din position sparas på din enhet för framtida besök.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Display formatted location name (may already include street if available from API)
    const displayName = userLocation.city.length > 25 
      ? userLocation.city.split(',')[0]
      : userLocation.city;
    
    return (
      <>
        <div className="bg-gradient-to-br from-location-light/30 to-location-light/10 rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-location/10 p-2 rounded-full">
                <MapPin size={18} className="text-location" />
              </div>
              <div>
                <span className="font-medium text-sm line-clamp-1 text-location-dark">{displayName}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowLocationDrawer(true)}
              className="text-location border-location/30 hover:bg-location/10"
            >
              Byt plats
            </Button>
          </div>
        </div>
        
        {mockCompetitions.length > 0 ? (
          mockCompetitions.map(competition => (
            <CompetitionCard 
              key={competition.id} 
              competition={{
                ...competition,
                distance: calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  competition.coordinates.latitude,
                  competition.coordinates.longitude
                )
              }} 
            />
          ))
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
        <div className="mt-4" onClick={handleTap}>
          {renderContent()}
        </div>
      </MobileLayout>
      
      <Drawer open={showLocationDrawer} onOpenChange={setShowLocationDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Ange din plats</DrawerTitle>
            <DrawerDescription>
              Ange din plats för att hitta tävlingar nära dig.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <LocationInputForm 
              onLocationSelected={handleUpdateLocation}
              onCancel={() => setShowLocationDrawer(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
      
      <Drawer open={showResetDrawer} onOpenChange={setShowResetDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Återställ platsval</DrawerTitle>
            <DrawerDescription>
              Detta kommer ta bort din sparade plats. Du kommer att behöva ange din plats igen.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="flex justify-center">
              <RefreshCw size={48} className="text-primary" />
            </div>
            <Button 
              onClick={handleResetLocation}
              className="w-full"
            >
              Återställ plats
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowResetDrawer(false)}
              className="w-full"
            >
              Avbryt
            </Button>
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
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

export default CompetitionsPage;
