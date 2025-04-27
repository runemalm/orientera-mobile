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
    updateUserLocation(location);
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
