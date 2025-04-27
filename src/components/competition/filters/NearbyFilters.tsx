
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Filter } from '../../../types';

interface NearbyFiltersProps {
  filters: Filter;
  userCity?: string;
  onFiltersChange: (filters: Filter) => void;
  onLocationChangeClick: () => void;
}

const NearbyFilters: React.FC<NearbyFiltersProps> = ({
  filters,
  userCity,
  onFiltersChange,
  onLocationChangeClick,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 text-forest mb-3">
        <MapPin className="h-5 w-5" />
        <h2 className="font-semibold">Plats</h2>
      </div>
      
      <div className="space-y-4 mt-2">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{userCity}</span>
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={onLocationChangeClick}
              className="text-forest hover:text-forest-dark border-forest hover:border-forest-dark"
            >
              Byt plats
            </Button>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="distance-slider" className="text-sm text-gray-600">
              Maxavstånd: {filters.maxDistanceKm} km
            </Label>
          </div>
          <Slider
            id="distance-slider"
            defaultValue={[filters.maxDistanceKm]}
            min={5}
            max={500}
            step={5}
            onValueChange={([value]) => {
              onFiltersChange({...filters, maxDistanceKm: value});
            }}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>5 km</span>
            <span>500 km</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyFilters;
