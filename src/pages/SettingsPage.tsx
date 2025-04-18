
import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { useUserLocation } from '../hooks/useUserLocation';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, MapPin } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import LocationInputForm from '../components/LocationInputForm';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatSwedishDate } from '../utils/dateUtils';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const SettingsPage: React.FC = () => {
  const { userLocation, updateUserLocation } = useUserLocation();
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [dateRange, setDateRange] = useLocalStorage<{
    from: Date | undefined;
    to: Date | undefined;
  }>('competitionDateRange', {
    from: undefined,
    to: undefined,
  });
  const navigate = useNavigate();

  // Helper function to ensure we're working with Date objects
  const handleDateSelection = (field: 'from' | 'to', date: Date | undefined) => {
    setDateRange({ 
      ...dateRange, 
      [field]: date 
    });
  };

  const handleLocationUpdate = (location: { city: string; latitude: number; longitude: number }) => {
    updateUserLocation(location);
    setShowLocationInput(false);
  };

  const handleApplyFilters = () => {
    navigate('/competitions');
    toast({
      title: "Filter uppdaterade",
      description: "Tävlingslistan har uppdaterats med dina valda datumfilter.",
    });
  };

  // Ensure dates from localStorage are converted to Date objects for display
  const getFromDate = () => {
    if (!dateRange.from) return undefined;
    return dateRange.from instanceof Date ? dateRange.from : new Date(dateRange.from);
  };

  const getToDate = () => {
    if (!dateRange.to) return undefined;
    return dateRange.to instanceof Date ? dateRange.to : new Date(dateRange.to);
  };

  return (
    <MobileLayout title="Inställningar">
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

        {/* Date filter section */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 text-forest">
            <CalendarDays className="h-5 w-5" />
            <h2 className="font-semibold">Tävlingsperiod</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-col gap-4">
              {/* From date */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Från datum</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        formatSwedishDate(getFromDate(), 'PPP')
                      ) : (
                        <span>Välj startdatum</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={getFromDate()}
                      onSelect={(date) => handleDateSelection('from', date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* To date */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Till datum</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.to ? (
                        formatSwedishDate(getToDate(), 'PPP')
                      ) : (
                        <span>Välj slutdatum</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={getToDate()}
                      onSelect={(date) => handleDateSelection('to', date)}
                      disabled={(date) => 
                        dateRange.from && date < getFromDate()!
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Apply button */}
              <Button
                className="w-full bg-forest hover:bg-forest-dark"
                onClick={handleApplyFilters}
              >
                Uppdatera tävlingar
              </Button>
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
