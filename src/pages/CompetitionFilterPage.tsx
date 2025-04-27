
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
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

const CompetitionFilterPage = () => {
  const navigate = useNavigate();
  const { userLocation, updateUserLocation, resetUserLocation } = useUserLocation();
  const [filters, setFilters] = useLocalStorage<Filter>('competitionFilters', DEFAULT_FILTERS);
  const [viewMode] = useLocalStorage<'calendar' | 'list'>('competitionViewMode', 'calendar');

  const handleUpdateLocation = (location: { city: string; latitude: number; longitude: number }) => {
    // Update location and enable location filter
    updateUserLocation(location);
    // Fix the TypeScript error by explicitly typing the updated filter object
    const updatedFilters: Filter = {
      ...filters,
      useLocationFilter: true
    };
    setFilters(updatedFilters);
    
    // Show success toast for better UX
    toast.success('Plats uppdaterad', {
      description: `Din plats har ändrats till ${location.city}`
    });
  };

  const handleApplyFilters = () => {
    navigate(-1);
    toast.success('Filter inställningar sparade', {
      description: 'Dina filterinställningar har uppdaterats'
    });
  };

  const handleResetFilters = () => {
    if (viewMode === 'list') {
      resetUserLocation();
    }
    setFilters(DEFAULT_FILTERS);
    toast.info('Filtren har återställts');
    
    navigate('/competitions', { 
      state: { 
        transition: 'slide' 
      }
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <MobileLayout 
      title="Filter" 
      action={
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      }
    >
      <div className="p-4 pb-24">
        {viewMode === 'calendar' ? (
          <CalendarFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        ) : (
          <NearbyFilters
            filters={filters}
            userCity={userLocation?.city}
            onFiltersChange={setFilters}
            onLocationChangeClick={handleUpdateLocation}
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
    </MobileLayout>
  );
};

export default CompetitionFilterPage;
