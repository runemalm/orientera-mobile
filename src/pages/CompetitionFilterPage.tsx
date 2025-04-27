
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { toast } from 'sonner';
import LocationInputForm from '../components/LocationInputForm';
import { useUserLocation } from '../hooks/useUserLocation';
import { useLocalStorage } from '../hooks/useLocalStorage';
import CalendarFilters from '../components/competition/filters/CalendarFilters';
import NearbyFilters from '../components/competition/filters/NearbyFilters';
import { Filter } from '../types';

const DEFAULT_FILTERS: Filter = {
  useLocationFilter: false,
  maxDistanceKm: 100,
  districts: [],
  disciplines: [],
  competitionTypes: [],
  branches: [],
  dateRange: {
    from: null,
    to: null
  }
};

interface RouteState {
  activeTab?: 'calendar' | 'list';
}

const CompetitionFilterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userLocation, updateUserLocation } = useUserLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useLocalStorage<Filter>('competitionFilters', DEFAULT_FILTERS);
  
  // Get the state from location instead of window.history
  const state = location.state as RouteState;
  const activeTab = state?.activeTab || 'calendar';

  const handleUpdateLocation = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setDrawerOpen(false);
    
    // Update filters to enable location filter when location is set
    setFilters({
      ...filters,
      useLocationFilter: true
    });
  };

  const handleApplyFilters = () => {
    navigate(-1);
    toast.success('Filter inställningar sparade', {
      description: 'Dina filterinställningar har uppdaterats'
    });
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    toast.info('Filtren har återställts');
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
      <div className="p-4 pb-24">
        {activeTab === 'calendar' ? (
          <CalendarFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        ) : (
          <NearbyFilters
            filters={filters}
            userCity={userLocation?.city}
            onFiltersChange={setFilters}
            onLocationChangeClick={() => setDrawerOpen(true)}
          />
        )}

        <div className="flex items-center gap-4 pt-6">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleResetFilters}
          >
            Återställ
          </Button>
          <Button 
            className="flex-1 bg-forest hover:bg-forest-dark"
            onClick={handleApplyFilters}
          >
            Tillämpa filter
          </Button>
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

export default CompetitionFilterPage;
