
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, MapPin, X } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Calendar } from '@/components/ui/calendar';
import { useUserLocation } from '../../hooks/useUserLocation';
import { addDays, addMonths, format } from 'date-fns';
import LocationInputForm from '../LocationInputForm';

interface CompetitionFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (dateRange: { from: Date; to: Date }) => void;
  initialDateRange: { from: Date; to: Date };
}

const CompetitionFilters: React.FC<CompetitionFiltersProps> = ({
  open,
  onOpenChange,
  onApplyFilters,
  initialDateRange
}) => {
  const { userLocation, updateUserLocation } = useUserLocation();
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(initialDateRange);

  // Preset date ranges
  const datePresets = [
    { label: 'Denna vecka', range: { from: new Date(), to: addDays(new Date(), 7) } },
    { label: '2 veckor', range: { from: new Date(), to: addDays(new Date(), 14) } },
    { label: '1 månad', range: { from: new Date(), to: addMonths(new Date(), 1) } },
    { label: '2 månader', range: { from: new Date(), to: addMonths(new Date(), 2) } },
  ];

  const handleLocationUpdate = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setShowLocationInput(false);
  };

  const handleApply = () => {
    onApplyFilters(dateRange);
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
        
        <div className="p-4 space-y-4">
          {/* Location section */}
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

          {/* Date range section */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 text-forest">
              <CalendarIcon className="h-5 w-5" />
              <h2 className="font-semibold">Datum</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {datePresets.map((preset, index) => (
                <Button 
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setDateRange(preset.range)}
                  className={`text-sm ${
                    dateRange.from.getTime() === preset.range.from.getTime() && 
                    dateRange.to.getTime() === preset.range.to.getTime()
                      ? 'bg-forest text-white hover:bg-forest-dark border-forest'
                      : ''
                  }`}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm mb-2 text-center">
                <span className="font-medium">
                  {format(dateRange.from, 'd MMM')} - {format(dateRange.to, 'd MMM')}
                </span>
              </div>
              <Calendar
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                  }
                }}
                numberOfMonths={2}
                className="mx-auto"
              />
            </div>
          </div>
        </div>
        
        <DrawerFooter>
          <Button 
            className="w-full bg-forest hover:bg-forest-dark" 
            onClick={handleApply}
          >
            Visa tävlingar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CompetitionFilters;
