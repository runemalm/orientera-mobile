
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  OrienteeringDistrict, 
  Discipline, 
  CompetitionType,
  Branch,
  Filter 
} from '../types';
import { sv } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { useUserLocation } from '../hooks/useUserLocation';
import LocationInputForm from '../components/LocationInputForm';

// Import filter components
import BranchFilter from '../components/filters/BranchFilter';
import DistrictFilter from '../components/filters/DistrictFilter';
import DisciplineFilter from '../components/filters/DisciplineFilter';
import CompetitionTypeFilter from '../components/filters/CompetitionTypeFilter';
import DateRangeFilter from '../components/filters/DateRangeFilter';
import LocationFilter from '../components/filters/LocationFilter';
import FixedBottomButton from '../components/filters/FixedBottomButton';

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

type DatePickerType = 'from' | 'to' | null;

const ManualFilterPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useLocalStorage<Filter>('competitionFilters', DEFAULT_FILTERS);
  const [initialFilters, setInitialFilters] = useState<Filter>({} as Filter);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [datePickerType, setDatePickerType] = useState<DatePickerType>(null);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const { userLocation, updateUserLocation } = useUserLocation();
  const [hasChanges, setHasChanges] = useState(false);
  
  // Store initial filter state when component mounts
  useEffect(() => {
    // Create a deep copy of filters to avoid reference issues
    setInitialFilters(JSON.parse(JSON.stringify(filters)));
  }, []);
  
  // Check for changes whenever filters change
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      const currentFiltersStr = JSON.stringify(filters);
      const initialFiltersStr = JSON.stringify(initialFilters);
      setHasChanges(currentFiltersStr !== initialFiltersStr);
    }
  }, [filters, initialFilters]);
  
  // Calculate number of active filters for the subtitle
  const getActiveFiltersCount = () => {
    let count = 0;
    
    if (filters.districts.length > 0) count++;
    if (filters.disciplines.length > 0) count++;
    if (filters.competitionTypes.length > 0) count++;
    if (filters.branches.length > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.useLocationFilter) count++;
    
    return count;
  };
  
  const activeFiltersCount = getActiveFiltersCount();
  const subtitle = activeFiltersCount > 0 ? `${activeFiltersCount} aktiva filter` : undefined;

  const clearFilters = () => {
    const currentLocationSettings = {
      maxDistanceKm: filters.maxDistanceKm,
      useLocationFilter: false // Disable the location filter
    };
    
    setFilters({
      ...DEFAULT_FILTERS,
      ...currentLocationSettings
    });
  };

  const handleCancel = () => {
    // Restore initial filters to localStorage directly
    localStorage.setItem('competitionFilters', JSON.stringify(initialFilters));
    
    // Update the current state as well
    setFilters(initialFilters);
    
    // Navigate back
    navigate('/competitions');
  };

  const handleSave = () => {
    // Filters are already saved in localStorage via the useLocalStorage hook
    navigate('/competitions');
  };

  const handleOpenDatePicker = (type: DatePickerType) => {
    setDatePickerType(type);
    setDatePickerOpen(true);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (datePickerType && date) {
      const currentDateRange = filters?.dateRange || { from: null, to: null };
      setFilters({
        ...filters,
        dateRange: {
          ...currentDateRange,
          [datePickerType]: date
        }
      });
      setDatePickerOpen(false);
    }
  };

  const handleBranchToggle = (branch: Branch) => {
    if (filters.branches.includes(branch)) {
      setFilters({
        ...filters,
        branches: filters.branches.filter(b => b !== branch)
      });
    } else {
      setFilters({
        ...filters,
        branches: [...filters.branches, branch]
      });
    }
  };

  const handleDistrictToggle = (district: OrienteeringDistrict) => {
    if (filters.districts.includes(district)) {
      setFilters({
        ...filters,
        districts: filters.districts.filter(d => d !== district)
      });
    } else {
      setFilters({
        ...filters,
        districts: [...filters.districts, district]
      });
    }
  };

  const handleDisciplineToggle = (discipline: Discipline) => {
    if (filters.disciplines.includes(discipline)) {
      setFilters({
        ...filters,
        disciplines: filters.disciplines.filter(d => d !== discipline)
      });
    } else {
      setFilters({
        ...filters,
        disciplines: [...filters.disciplines, discipline]
      });
    }
  };

  const handleCompetitionTypeToggle = (type: CompetitionType) => {
    if (filters.competitionTypes.includes(type)) {
      setFilters({
        ...filters,
        competitionTypes: filters.competitionTypes.filter(t => t !== type)
      });
    } else {
      setFilters({
        ...filters,
        competitionTypes: [...filters.competitionTypes, type]
      });
    }
  };

  const handleLocationSelect = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setLocationDialogOpen(false);
    
    // If selecting a location, also enable the location filter
    if (!filters.useLocationFilter) {
      setFilters({
        ...filters,
        useLocationFilter: true
      });
    }
  };

  const handleLocationFilterToggle = () => {
    setFilters({
      ...filters,
      useLocationFilter: !filters.useLocationFilter
    });
  };

  const handleDistanceChange = (value: number[]) => {
    setFilters({
      ...filters,
      maxDistanceKm: value[0]
    });
  };

  // Custom action buttons for the iOS-style navigation bar
  const CancelButton = () => (
    <Button 
      variant="ghost" 
      onClick={handleCancel}
      className="text-red-600 font-medium"
    >
      Avbryt
    </Button>
  );

  const SaveButton = () => (
    <Button 
      variant="ghost" 
      onClick={handleSave}
      disabled={!hasChanges}
      className={cn(
        "font-medium",
        hasChanges ? "text-blue-600" : "text-blue-300"
      )}
    >
      Spara
    </Button>
  );

  return (
    <MobileLayout 
      title="Filtrera" 
      action={<SaveButton />}
      leftAction={<CancelButton />}
      subtitle={subtitle}
    >
      <div className="p-4 pb-32">
        <div className="space-y-8">
          {/* Two-column layout for filters with proper height management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column: District Section */}
            <DistrictFilter 
              selectedDistricts={filters.districts} 
              onToggle={handleDistrictToggle} 
            />

            {/* Right column: Stacked sections */}
            <div className="space-y-4">
              {/* Branch Section */}
              <BranchFilter 
                selectedBranches={filters.branches} 
                onToggle={handleBranchToggle}
              />
              
              {/* Discipline Section */}
              <DisciplineFilter 
                selectedDisciplines={filters.disciplines}
                onToggle={handleDisciplineToggle}
              />
              
              {/* Competition Type Section */}
              <CompetitionTypeFilter 
                selectedTypes={filters.competitionTypes}
                onToggle={handleCompetitionTypeToggle}
              />
            </div>
          </div>
          
          {/* Date Range Section */}
          <DateRangeFilter 
            from={filters.dateRange.from}
            to={filters.dateRange.to}
            onSelectDate={handleOpenDatePicker}
          />

          {/* Location Filter Section */}
          <LocationFilter 
            useLocationFilter={filters.useLocationFilter}
            locationCity={userLocation?.city}
            maxDistanceKm={filters.maxDistanceKm}
            onLocationFilterToggle={handleLocationFilterToggle}
            onOpenLocationDialog={() => setLocationDialogOpen(true)}
            onDistanceChange={handleDistanceChange}
          />
        </div>

        {/* Date picker dialog */}
        <Dialog open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {datePickerType === 'from' ? 'Välj startdatum' : 'Välj slutdatum'}
              </DialogTitle>
              <DialogDescription>
                Välj datum nedan
              </DialogDescription>
            </DialogHeader>
            <Calendar
              mode="single"
              selected={datePickerType === 'from' 
                ? filters?.dateRange?.from || undefined 
                : filters?.dateRange?.to || undefined
              }
              onSelect={handleDateSelect}
              disabled={(date) => 
                datePickerType === 'from'
                  ? filters?.dateRange?.to ? date > filters.dateRange.to : false
                  : filters?.dateRange?.from ? date < filters.dateRange.from : false
              }
              locale={sv}
              className="mx-auto"
            />
          </DialogContent>
        </Dialog>

        {/* Location selection dialog */}
        <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Välj plats
              </DialogTitle>
              <DialogDescription>
                Sök efter en stad eller plats för att filtrera tävlingar baserat på avstånd.
              </DialogDescription>
            </DialogHeader>
            <LocationInputForm 
              onLocationSelected={handleLocationSelect}
              onCancel={() => setLocationDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        
        {/* Sticky Clear Filter button */}
        <FixedBottomButton 
          onClick={clearFilters}
          className="bg-white border border-dashed border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
        >
          Rensa filtret
        </FixedBottomButton>
      </div>
    </MobileLayout>
  );
};

export default ManualFilterPage;
