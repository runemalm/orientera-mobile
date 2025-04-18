
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useUserLocation } from '../../hooks/useUserLocation';
import LocationInputForm from '../LocationInputForm';

interface CompetitionFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: () => void;
}

const CompetitionFilters: React.FC<CompetitionFiltersProps> = ({
  open,
  onOpenChange,
  onApplyFilters,
}) => {
  const { userLocation, updateUserLocation } = useUserLocation();
  const [showLocationInput, setShowLocationInput] = useState(false);

  const handleLocationUpdate = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setShowLocationInput(false);
    onApplyFilters();
  };

  if (showLocationInput) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Byt plats</DrawerTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4"
              onClick={() => setShowLocationInput(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerHeader>
          <div className="p-4">
            <LocationInputForm 
              onLocationSelected={handleLocationUpdate}
              onCancel={() => setShowLocationInput(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter</DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4">
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CompetitionFilters;
