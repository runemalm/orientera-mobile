import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useLocalStorage } from '../hooks/useLocalStorage';
import CalendarFilters from '../components/competition/filters/CalendarFilters';
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
  const [filters, setFilters] = useLocalStorage<Filter>('competitionFilters', DEFAULT_FILTERS);

  const handleApplyFilters = () => {
    navigate(-1);
    toast.success('Filter inställningar sparade', {
      description: 'Dina filterinställningar har uppdaterats'
    });
  };

  // Update the reset filters function to keep location settings but disable the checkbox
  const handleResetFilters = () => {
    const currentLocationSettings = {
      maxDistanceKm: filters.maxDistanceKm,
      useLocationFilter: false // Disable the location filter
    };
    
    setFilters({
      ...DEFAULT_FILTERS,
      ...currentLocationSettings
    });
    
    toast.info('Filtren har återställts', {
      description: 'Alla filterval har rensats förutom platsinformation'
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
          onClick={handleResetFilters}
          className="text-muted-foreground"
        >
          <Trash className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      }
      leftAction={
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
        <CalendarFilters
          filters={filters}
          onFiltersChange={setFilters}
        />

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
