
import React from 'react';
import { MapPin } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import FilterSection from './FilterSection';
import { cn } from "@/lib/utils";
import { formatDistance } from '@/utils/distanceUtils';

interface LocationFilterProps {
  useLocationFilter: boolean;
  locationCity?: string | null;
  maxDistanceKm: number;
  onLocationFilterToggle: () => void;
  onOpenLocationDialog: () => void;
  onDistanceChange: (value: number[]) => void;
}

const LocationFilter = ({ 
  useLocationFilter, 
  locationCity, 
  maxDistanceKm,
  onLocationFilterToggle,
  onOpenLocationDialog,
  onDistanceChange
}: LocationFilterProps) => {
  return (
    <FilterSection icon={MapPin} title="Platsfiltrering">
      <div className="space-y-4">
        {/* Location filter toggle */}
        <div className="flex items-center justify-between">
          <label 
            htmlFor="use-location-filter"
            className="text-sm"
          >
            Filtrera tävlingar baserat på avstånd
          </label>
          <Switch 
            id="use-location-filter"
            checked={useLocationFilter}
            onCheckedChange={onLocationFilterToggle}
          />
        </div>

        {/* Selected location display and change button */}
        <div className="space-y-2">
          <Label className="block">Plats</Label>
          <div className="flex items-center gap-2">
            <div className={cn(
              "border rounded-md p-2 flex-1", 
              !useLocationFilter ? "bg-gray-100" : "bg-gray-50"
            )}>
              {locationCity ? (
                <div className="flex items-center gap-2">
                  <MapPin className={cn(
                    "h-4 w-4 flex-shrink-0", 
                    useLocationFilter ? "text-forest" : "text-gray-400"
                  )} />
                  <span className={!useLocationFilter ? "text-gray-500" : ""}>
                    {locationCity}
                  </span>
                </div>
              ) : (
                <div className="text-gray-500">Ingen plats vald</div>
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={onOpenLocationDialog}
              className="whitespace-nowrap"
            >
              {locationCity ? 'Ändra' : 'Välj plats'}
            </Button>
          </div>
        </div>

        {/* Distance slider */}
        <div className={cn(
          "space-y-4",
          !useLocationFilter && "opacity-75"
        )}>
          <div className="flex justify-between items-center">
            <Label className={!useLocationFilter ? "text-gray-500" : ""}>
              Maxavstånd
            </Label>
            <span className={cn(
              "text-sm font-medium",
              !useLocationFilter && "text-gray-500"
            )}>
              {formatDistance(maxDistanceKm)}
            </span>
          </div>
          <div className="py-2">
            <input
              type="range"
              disabled={!useLocationFilter}
              value={maxDistanceKm}
              min={5}
              max={500}
              step={5}
              onChange={(e) => onDistanceChange([parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>5 km</span>
            <span>500 km</span>
          </div>
        </div>
      </div>
    </FilterSection>
  );
};

export default LocationFilter;
