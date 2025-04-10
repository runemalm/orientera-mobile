
import React, { useState, useEffect } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionCard from '../components/CompetitionCard';
import { mockCompetitions } from '../utils/mockData';
import { MapPin, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

const CompetitionsPage: React.FC = () => {
  const [locationStatus, setLocationStatus] = useState<'checking' | 'prompt' | 'granted' | 'denied'>('checking');
  const [showResetDrawer, setShowResetDrawer] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const navigate = useNavigate();

  // Check location permission on mount
  useEffect(() => {
    checkLocationPermission();
  }, []);

  // Handle tap count reset
  useEffect(() => {
    if (tapCount > 0) {
      const resetTimer = setTimeout(() => {
        setTapCount(0);
      }, 2000);
      
      return () => clearTimeout(resetTimer);
    }
  }, [tapCount]);

  // Handle tap count trigger for reset drawer
  useEffect(() => {
    if (tapCount >= 3) {
      setShowResetDrawer(true);
      setTapCount(0);
    }
  }, [tapCount]);

  const checkLocationPermission = async () => {
    try {
      if (!navigator.geolocation) {
        setLocationStatus('denied');
        setInitialCheckDone(true);
        return;
      }
      
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      
      if (permissionStatus.state === 'granted') {
        setLocationStatus('granted');
      } else if (permissionStatus.state === 'denied') {
        setLocationStatus('denied');
      } else {
        setLocationStatus('prompt');
      }
      
      setInitialCheckDone(true);
      
      permissionStatus.addEventListener('change', () => {
        setLocationStatus(permissionStatus.state as 'granted' | 'denied' | 'prompt');
      });
    } catch (error) {
      console.error("Error checking location permission:", error);
      setLocationStatus('denied');
      setInitialCheckDone(true);
    }
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationStatus('granted');
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationStatus('denied');
        }
      );
    }
  };
  
  const handleLongPress = () => {
    setLongPressTimer(
      setTimeout(() => {
        setShowResetDrawer(true);
      }, 5000)
    );
  };
  
  const handlePressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };
  
  const resetLocationPermissions = async () => {
    try {
      const permissions = await navigator.permissions.query({ name: 'geolocation' });
      
      setLocationStatus('prompt');
      setShowResetDrawer(false);
    } catch (error) {
      console.error("Error resetting location permissions:", error);
    }
  };

  const handleTap = () => {
    setTapCount(prevCount => prevCount + 1);
  };

  // Content based on location permission status
  const renderContent = () => {
    if (!initialCheckDone) {
      return (
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-gray-600">Kontrollerar platsbehörigheter...</p>
        </div>
      );
    }

    if (locationStatus === 'granted') {
      return (
        <>
          <div 
            className="mb-4"
            onTouchStart={handleLongPress}
            onTouchEnd={handlePressEnd}
            onTouchCancel={handlePressEnd}
            onMouseDown={handleLongPress}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onClick={handleTap}
          >
            <Alert className="bg-green-50 border-green-200">
              <MapPin className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">Platsspårning aktiv</AlertTitle>
              <AlertDescription className="text-green-700 text-sm">
                Vi visar tävlingar nära din nuvarande position.
              </AlertDescription>
            </Alert>
          </div>
          {mockCompetitions.length > 0 ? (
            mockCompetitions.map(competition => (
              <CompetitionCard key={competition.id} competition={competition} />
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
    }
    
    // For 'prompt' or 'denied' statuses - redesigned from a block to a more integrated design
    return (
      <div className="space-y-6 py-6">
        {/* Location permission banner */}
        <div className="bg-gradient-to-br from-forest-light/30 to-forest-light/10 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MapPin size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-2 text-forest-dark">Visa tävlingar nära dig</h2>
              <p className="text-gray-600 mb-4">
                Aktivera platsinformation för att se tävlingar i ditt område.
              </p>
              <Button 
                onClick={requestLocationPermission}
                className="w-full sm:w-auto flex items-center justify-center gap-2"
                size="sm"
              >
                <MapPin size={16} />
                Aktivera plats
              </Button>
            </div>
          </div>
        </div>

        {/* Static competitions list */}
        <div className="mt-4">
          <h2 className="text-lg font-medium mb-4 text-gray-700">Populära tävlingar</h2>
          {mockCompetitions.slice(0, 3).map(competition => (
            <CompetitionCard key={competition.id} competition={competition} />
          ))}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">Aktivera plats för att se fler tävlingar nära dig</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MobileLayout title="Tävlingar i närheten">
      {renderContent()}
      
      <Drawer open={showResetDrawer} onOpenChange={setShowResetDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Återställ platsåtkomst</DrawerTitle>
            <DrawerDescription>
              Detta kommer att återställa behörigheterna för platsåtkomst. Du kommer att behöva godkänna platsåtkomst igen.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="flex justify-center">
              <RefreshCw size={48} className="text-primary" />
            </div>
            <Button 
              onClick={resetLocationPermissions}
              className="w-full"
            >
              Återställ platsåtkomst
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
    </MobileLayout>
  );
};

export default CompetitionsPage;
