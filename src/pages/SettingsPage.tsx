
import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { useUserLocation } from '../hooks/useUserLocation';
import { Button } from '@/components/ui/button';
import { MapPin, CalendarRange } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import LocationInputForm from '../components/LocationInputForm';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SettingsPage: React.FC = () => {
  const { userLocation, updateUserLocation } = useUserLocation();
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [daysBack, setDaysBack] = useLocalStorage<number>('competitionsDaysBack', 1);

  const handleLocationUpdate = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setShowLocationInput(false);
  };

  const handleDaysBackChange = (value: number[]) => {
    setDaysBack(value[0]);
  };

  return (
    <MobileLayout title="Inställningar">
      <div className="h-full overflow-hidden p-4">
        <div className="space-y-4 overflow-hidden">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
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
                  onClick={() => setShowLocationInput(true)}
                  className="text-forest hover:text-forest-dark border-forest hover:border-forest-dark"
                >
                  Byt plats
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 text-forest">
              <CalendarRange className="h-5 w-5" />
              <h2 className="font-semibold">Tidsperiod för tävlingar</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  Visa tävlingar {daysBack} dagar tillbaka i tiden
                </label>
                <Slider
                  defaultValue={[daysBack]}
                  max={30}
                  min={1}
                  step={1}
                  onValueChange={handleDaysBackChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Drawer open={showLocationInput} onOpenChange={setShowLocationInput}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Byt plats</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <LocationInputForm 
              onLocationSelected={handleLocationUpdate}
              onCancel={() => setShowLocationInput(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </MobileLayout>
  );
};

export default SettingsPage;
