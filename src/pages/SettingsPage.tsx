
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import LocationInputForm from '../components/LocationInputForm';
import { useUserLocation } from '../hooks/useUserLocation';

const SettingsPage: React.FC = () => {
  const [showLocationSheet, setShowLocationSheet] = React.useState(false);
  const { userLocation, updateUserLocation } = useUserLocation();
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
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

  const handleUpdateLocation = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setShowLocationSheet(false);
  };

  const displayName = userLocation?.city 
    ? (userLocation.city.length > 25 ? userLocation.city.split(',')[0] : userLocation.city)
    : 'Ingen plats vald';

  return (
    <>
      <MobileLayout title="Inställningar">
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Plats</h2>
              <p className="text-sm text-gray-500">Din plats används för att hitta tävlingar nära dig</p>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-forest/10 p-2 rounded-full">
                    <Settings size={18} className="text-forest" />
                  </div>
                  <span className="font-medium text-sm">{displayName}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowLocationSheet(true)}
                >
                  Byt plats
                </Button>
              </div>
            </div>
          </div>
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

export default SettingsPage;
