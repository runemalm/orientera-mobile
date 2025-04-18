
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { User, Settings, Info, MapPin, Compass, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import LocationInputForm from '../components/LocationInputForm';
import { useUserLocation } from '../hooks/useUserLocation';

const ProfilePage: React.FC = () => {
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
      <MobileLayout title="Min profil">
        <div className="p-4 space-y-8">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-1">Min profil</h2>
            <p className="text-gray-500 mb-8">Logga in för att se din profil</p>
            <Button>Logga in</Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Plats</h2>
              <p className="text-sm text-gray-500">Din plats används för att hitta tävlingar nära dig</p>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-forest/10 p-2 rounded-full">
                    <MapPin size={18} className="text-forest" />
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

          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Info className="text-primary" size={24} />
              </div>
              <h2 className="text-xl font-bold">Om appen</h2>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full shrink-0 mt-1">
                  <Compass className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-base mb-1">Vår vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Att göra orientering mer tillgängligt genom en smidig, intuitiv plattform 
                    som förenklar alla aspekter av sporten - när du är hemma, på språng eller 
                    ute i terrängen.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full shrink-0 mt-1">
                  <MapPin className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-base mb-1">För alla situationer</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Appen är designad för att möta dina behov i alla situationer - vare sig du står 
                    på en tävling, sitter på bussen, planerar din vecka eller bara vill kolla 
                    kommande events i närheten.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full shrink-0 mt-1">
                  <Heart className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-base mb-1">Byggd av orienterare, för orienterare</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Som aktiva orienterare förstår vi sportens unika behov och vardagens utmaningar. 
                    Vi har byggt denna app med fokus på enkelhet och användbarhet.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 pb-4">
            <p>Version 1.0.0</p>
            <p>© 2025 Alla rättigheter förbehållna</p>
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

export default ProfilePage;
