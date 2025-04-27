
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, X, CalendarRange } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useUserLocation } from '../../hooks/useUserLocation';
import LocationInputForm from '../LocationInputForm';
import { Calendar } from '@/components/ui/calendar';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface CompetitionFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: () => void;
}

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface FilterState {
  useLocationFilter: boolean;
  maxDistanceKm: number;
  districts: string[];
  disciplines: string[];
  competitionTypes: string[];
  branches: string[];
  dateRange: DateRange;
}

const DEFAULT_FILTERS: FilterState = {
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

const CompetitionFilters: React.FC<CompetitionFiltersProps> = ({
  open,
  onOpenChange,
  onApplyFilters,
}) => {
  const { userLocation, updateUserLocation } = useUserLocation();
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filters, setFilters] = useLocalStorage<FilterState>('competitionFilters', DEFAULT_FILTERS);
  const [dateRange, setDateRange] = useState<DateRange>(filters.dateRange || { from: null, to: null });
  
  // Reset the state when drawer opens
  useEffect(() => {
    if (open) {
      setShowLocationInput(false);
      setShowDatePicker(false);
      // Update dateRange state from filters when drawer opens
      setDateRange(filters.dateRange || { from: null, to: null });
    }
  }, [open, filters]);
  
  const handleLocationUpdate = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setShowLocationInput(false);
    onApplyFilters();
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const newDateRange = { ...dateRange };
    
    // If no dates are selected or both dates are selected, start a new selection
    if (!newDateRange.from || (newDateRange.from && newDateRange.to)) {
      newDateRange.from = date;
      newDateRange.to = null;
    } 
    // If only the from date is selected and the new date is after it
    else if (!newDateRange.to && date >= newDateRange.from) {
      newDateRange.to = date;
    } 
    // If only the from date is selected and the new date is before it
    else {
      newDateRange.from = date;
      newDateRange.to = null;
    }
    
    setDateRange(newDateRange);
  };

  const handleApplyDateRange = () => {
    setFilters({
      ...filters,
      dateRange: dateRange
    });
    setShowDatePicker(false);
    onApplyFilters();
  };
  
  const handleClearDateRange = () => {
    const clearedDateRange = { from: null, to: null };
    setDateRange(clearedDateRange);
    setFilters({
      ...filters,
      dateRange: clearedDateRange
    });
    setShowDatePicker(false);
    onApplyFilters();
  };
  
  const formatDateRange = () => {
    const { from, to } = filters.dateRange || { from: null, to: null };
    
    if (from && to) {
      return `${format(from, 'd MMM', { locale: sv })} - ${format(to, 'd MMM', { locale: sv })}`;
    } else if (from) {
      return `Från ${format(from, 'd MMM', { locale: sv })}`;
    } else if (to) {
      return `Till ${format(to, 'd MMM', { locale: sv })}`;
    }
    return 'Välj datum';
  };

  const hasDateFilter = Boolean(filters.dateRange?.from || filters.dateRange?.to);

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
  
  if (showDatePicker) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Välj datumintervall</DrawerTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4"
              onClick={() => setShowDatePicker(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerHeader>
          <div className="p-4">
            <Calendar
              mode="range"
              selected={{
                from: dateRange.from || undefined,
                to: dateRange.to || undefined
              }}
              onSelect={(range) => {
                setDateRange({
                  from: range?.from || null,
                  to: range?.to || null
                });
              }}
              locale={sv}
              className="mx-auto pointer-events-auto"
            />
            
            <div className="flex gap-2 mt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleClearDateRange}
              >
                Rensa
              </Button>
              <Button 
                className="flex-1 bg-forest hover:bg-forest-dark"
                onClick={handleApplyDateRange}
              >
                Välj
              </Button>
            </div>
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
        
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 text-forest">
              <CalendarRange className="h-5 w-5" />
              <h2 className="font-semibold">Datumintervall</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarRange className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {hasDateFilter ? formatDateRange() : 'Alla datum'}
                  </span>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setShowDatePicker(true)}
                  className="text-forest hover:text-forest-dark border-forest hover:border-forest-dark"
                >
                  {hasDateFilter ? 'Ändra' : 'Välj datum'}
                </Button>
              </div>
            </div>
          </div>
          
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
