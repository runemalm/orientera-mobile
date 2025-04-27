
import React from 'react';
import { MapPin, Settings } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Filter } from '../../../types';
import LocationSearchInput from '../../LocationSearchInput';

interface NearbyFiltersProps {
  filters: Filter;
  userCity?: string;
  onFiltersChange: (filters: Filter) => void;
  onLocationChangeClick: (location: { city: string; latitude: number; longitude: number; }) => void;
}

const NearbyFilters: React.FC<NearbyFiltersProps> = ({
  filters,
  userCity,
  onFiltersChange,
  onLocationChangeClick,
}) => {
  if (!userCity) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-forest mb-4">
            <MapPin className="h-5 w-5" />
            <h2 className="font-semibold">Platsfilter</h2>
          </div>
          
          <LocationSearchInput 
            onLocationSelected={onLocationChangeClick}
          />
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 opacity-50">
          <div className="flex items-center gap-2 text-gray-400 mb-3">
            <Settings className="h-5 w-5" />
            <h2 className="font-semibold">Avståndsinställningar</h2>
          </div>
          
          <p className="text-sm text-gray-400 italic mb-2">
            Ange först din plats för att aktivera avståndsinställningar
          </p>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="distance-slider-disabled" className="text-sm text-gray-400">
                Maxavstånd: {filters.maxDistanceKm} km
              </Label>
            </div>
            <div className="h-10 flex items-center">
              <div className="w-full h-2 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleLocationChange = (location: { city: string; latitude: number; longitude: number }) => {
    // Update location and set the filter to use location
    onLocationChangeClick(location);
    onFiltersChange({...filters, useLocationFilter: true});
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 text-forest mb-3">
        <MapPin className="h-5 w-5" />
        <h2 className="font-semibold">Plats</h2>
      </div>
      
      <div className="space-y-4 mt-2">
        <div className="p-2 bg-gray-50 rounded-lg flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm">{userCity}</span>
        </div>
        
        <LocationSearchInput 
          onLocationSelected={handleLocationChange}
          currentCity={userCity}
        />
        
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
