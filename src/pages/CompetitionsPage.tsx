
import React, { useState, useEffect } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionCard from '../components/CompetitionCard';
import { mockCompetitions } from '../utils/mockData';
import { MapPin, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
    
    // For 'prompt' or 'denied' statuses
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 space-y-6">
        <Card className="border shadow-sm w-full max-w-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="bg-amber-50 p-4 rounded-full mb-4">
                <MapPin size={36} className="text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Hitta tävlingar nära dig</h2>
              <p className="text-gray-600 mb-6">
                För att visa tävlingar i närheten behöver appen tillgång till din position.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 p-6 pt-0">
            <Button 
              onClick={requestLocationPermission}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              <MapPin size={16} />
              Aktivera plats
            </Button>
          </CardFooter>
        </Card>
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
