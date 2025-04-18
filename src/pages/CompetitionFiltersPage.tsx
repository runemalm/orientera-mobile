
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft } from 'lucide-react';
import LocationInputForm from '../components/LocationInputForm';
import { useUserLocation } from '../hooks/useUserLocation';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const CompetitionFiltersPage = () => {
  const navigate = useNavigate();
  const { userLocation, updateUserLocation } = useUserLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleUpdateLocation = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setDrawerOpen(false);
  };

  return (
    <MobileLayout 
      title="Filter" 
      action={
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      }
    >
      <div className="p-4">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Plats
            </h2>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{userLocation.city}</span>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setDrawerOpen(true)}
                >
                  Byt plats
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Byt plats</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <LocationInputForm 
              onLocationSelected={handleUpdateLocation}
              onCancel={() => setDrawerOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </MobileLayout>
  );
};

export default CompetitionFiltersPage;
