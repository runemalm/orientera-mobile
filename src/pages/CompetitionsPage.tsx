
import React, { useState, useEffect } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionCard from '../components/CompetitionCard';
import { mockCompetitions } from '../utils/mockData';
import { MapPin, AlertTriangle, RefreshCw, Settings, MapPinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const CompetitionsPage: React.FC = () => {
  const [locationStatus, setLocationStatus] = useState<'checking' | 'prompt' | 'granted' | 'denied'>('checking');
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showResetDrawer, setShowResetDrawer] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

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

  // Automatically show permission dialog if status is "prompt" after initial check
  useEffect(() => {
    if (initialCheckDone && locationStatus === 'prompt') {
      setShowPermissionDialog(true);
    }
  }, [initialCheckDone, locationStatus]);

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
        if (permissionStatus.state === 'granted') {
          setShowPermissionDialog(false);
        }
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
          setShowPermissionDialog(false);
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
      setShowPermissionDialog(true);
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
        <div className="flex justify-center items-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
      <div className="flex flex-col items-center justify-center h-[70vh] px-4">
        <Card className="border shadow-sm overflow-hidden mb-6 w-full max-w-sm">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-amber-50 p-4 rounded-full mb-4">
              <MapPin size={36} className="text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Hitta tävlingar nära dig</h2>
            <p className="text-gray-600 mb-6">
              För att visa tävlingar i närheten behöver appen tillgång till din position.
            </p>
          </div>
        </Card>
        <Button 
          onClick={() => setShowPermissionDialog(true)}
          className="flex items-center gap-2 pointer-events-auto"
          size="lg"
        >
          <MapPin size={16} />
          Aktivera plats
        </Button>
      </div>
    );
  };

  return (
    <MobileLayout title="Tävlingar i närheten">
      {renderContent()}
      
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aktivera platsinformation</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              För att visa tävlingar nära dig behöver vi din plats.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="text-center mb-4">
              <MapPin size={48} className="text-primary mx-auto mb-2" />
              <p className="text-gray-700 mb-4">
                För att visa tävlingar i din närhet behöver vi tillgång till din plats. Detta hjälper oss att hitta de tävlingar som är närmast dig.
              </p>
            </div>
            <Button 
              onClick={requestLocationPermission} 
              className="w-full"
            >
              Tillåt platsinformation
            </Button>
            <button 
              className="w-full text-gray-500 mt-2 text-sm underline"
              onClick={() => setShowPermissionDialog(false)}
            >
              Inte nu
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
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
