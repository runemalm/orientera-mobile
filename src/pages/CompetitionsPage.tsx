
import React, { useState, useEffect } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionCard from '../components/CompetitionCard';
import { mockCompetitions } from '../utils/mockData';
import { MapPin, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';

const CompetitionsPage: React.FC = () => {
  const [locationStatus, setLocationStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showResetDrawer, setShowResetDrawer] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      if (!navigator.geolocation) {
        setLocationStatus('denied');
        return;
      }
      
      // Check if we can access the location
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      
      if (permissionStatus.state === 'granted') {
        setLocationStatus('granted');
      } else if (permissionStatus.state === 'denied') {
        setLocationStatus('denied');
        setShowPermissionDialog(true);
      } else {
        // In prompt state, let's show our dialog
        setShowPermissionDialog(true);
      }
      
      // Listen for changes to the permission state
      permissionStatus.addEventListener('change', () => {
        setLocationStatus(permissionStatus.state as 'granted' | 'denied' | 'prompt');
        if (permissionStatus.state === 'granted') {
          setShowPermissionDialog(false);
          toast({
            title: "Platsåtkomst aktiverad",
            description: "Nu kan du se tävlingar nära dig",
          });
        }
      });
    } catch (error) {
      console.error("Error checking location permission:", error);
      setLocationStatus('denied');
      setShowPermissionDialog(true);
    }
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationStatus('granted');
          setShowPermissionDialog(false);
          toast({
            title: "Platsåtkomst aktiverad",
            description: "Nu kan du se tävlingar nära dig",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationStatus('denied');
        }
      );
    }
  };
  
  // Handle long press on the location status section to open reset drawer
  const handleLongPress = () => {
    setLongPressTimer(
      setTimeout(() => {
        setShowResetDrawer(true);
      }, 2000) // 2 seconds long press
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
      // For browsers that support it, we can revoke permissions
      const permissions = await navigator.permissions.query({ name: 'geolocation' });
      
      // We can't programmatically revoke permissions, but we can guide the user
      setLocationStatus('prompt');
      setShowResetDrawer(false);
      
      toast({
        title: "Instruktioner för att återställa platsåtkomst",
        description: "Du måste gå till webbläsarens/telefonens inställningar för att återställa platsåtkomst fullständigt.",
      });
      
      // Force a new request
      setShowPermissionDialog(true);
    } catch (error) {
      console.error("Error resetting location permissions:", error);
      toast({
        title: "Kunde inte återställa",
        description: "Ett fel uppstod vid återställning av platsåtkomst.",
        variant: "destructive"
      });
    }
  };

  return (
    <MobileLayout title="Tävlingar i närheten">
      <div 
        className="bg-white rounded-lg p-3 mb-4 shadow-sm border border-gray-100"
        onTouchStart={handleLongPress}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
        onMouseDown={handleLongPress}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
      >
        <div className="flex items-center">
          <div className={`rounded-full p-2 mr-3 ${locationStatus === 'granted' ? 'bg-primary/10' : 'bg-amber-100'}`}>
            {locationStatus === 'granted' ? (
              <MapPin size={18} className="text-primary" />
            ) : (
              <AlertTriangle size={18} className="text-amber-500" />
            )}
          </div>
          <div>
            {locationStatus === 'granted' ? (
              <>
                <p className="text-sm font-medium text-gray-800">Visar tävlingar nära dig</p>
                <p className="text-xs text-gray-500">Baserat på din nuvarande position</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-800">Platsinformation saknas</p>
                <p className="text-xs text-gray-500">
                  <button 
                    onClick={() => setShowPermissionDialog(true)} 
                    className="text-primary underline"
                  >
                    Aktivera platsinformation
                  </button> för att visa tävlingar nära dig
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aktivera platsinformation</DialogTitle>
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
      
      <div>
        {locationStatus === 'granted' ? (
          mockCompetitions.length > 0 ? (
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
          )
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <AlertTriangle size={48} className="mx-auto" />
            </div>
            <p className="text-gray-700 font-medium">Platsinformation krävs</p>
            <p className="text-gray-500 mt-1">Du måste aktivera platsinformation för att se tävlingar i närheten</p>
            <Button 
              onClick={() => setShowPermissionDialog(true)} 
              variant="outline"
              className="mt-4"
            >
              Aktivera plats
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default CompetitionsPage;
