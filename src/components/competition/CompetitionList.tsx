
import React, { useState, useEffect } from 'react';
import { Star, MapPin } from 'lucide-react';
import { CompetitionSummary } from '../../types';
import CompetitionCard from '../CompetitionCard';
import { UserLocation } from '../../hooks/useUserLocation';
import { Button } from '../ui/button';
import LocationInputForm from '../LocationInputForm';
import { Slider } from '../ui/slider';

interface CompetitionListProps {
  competitions: CompetitionSummary[];
  userLocation: UserLocation | null;
  showFavorites?: boolean;
  filters: {
    maxDistanceKm: number;
    useLocationFilter: boolean;
    districts: string[];
    disciplines: string[];
    competitionTypes: string[];
    branches: string[];
    dateRange: {
      from: Date | null;
      to: Date | null;
    };
  };
  onUpdateFilters: (filters: any) => void;
}

const CompetitionList: React.FC<CompetitionListProps> = ({ 
  competitions, 
  userLocation,
  showFavorites = false,
  filters,
  onUpdateFilters
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  
  // Load favorites from localStorage
  useEffect(() => {
    const storedFavoritesStr = window.localStorage.getItem('favoriteCompetitions');
    if (storedFavoritesStr) {
      try {
        const parsed = JSON.parse(storedFavoritesStr);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Error parsing favorites:', error);
        setFavorites([]);
      }
    }
  }, []);

  const handleLocationSelected = (location: { city: string; latitude: number; longitude: number }) => {
    window.dispatchEvent(new CustomEvent('locationUpdated', { 
      detail: location 
    }));
    setIsChangingLocation(false);
  };

  const handleRadiusChange = (value: number[]) => {
    onUpdateFilters({
      ...filters,
      maxDistanceKm: value[0]
    });
  };
  
  if (!userLocation) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="bg-muted/50 p-5 rounded-full mb-5">
          <MapPin className="w-10 h-10 text-forest" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Sätt din position</h2>
        <p className="text-gray-500 mb-6">
          För att se tävlingar nära dig behöver du ange din position.
        </p>
        <div className="w-full max-w-md">
          <LocationInputForm onLocationSelected={handleLocationSelected} />
        </div>
      </div>
    );
  }
  
  if (isChangingLocation) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Byt plats</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsChangingLocation(false)}
          >
            Avbryt
          </Button>
        </div>
        <LocationInputForm 
          onLocationSelected={handleLocationSelected}
          onCancel={() => setIsChangingLocation(false)}
        />
      </div>
    );
  }

  // Filter competitions by radius if needed
  const filteredCompetitions = showFavorites
    ? competitions.filter(comp => favorites.includes(comp.id))
    : competitions;
    
  if (filteredCompetitions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <Star className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-gray-500">
          {showFavorites ? 'Inga favorittävlingar än' : 'Inga tävlingar hittades'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 pb-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsChangingLocation(true)}
          className="flex items-center gap-1 border-dashed text-muted-foreground"
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>{userLocation.city}</span>
        </Button>

        <div className="space-y-2 px-1">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Maxavstånd</span>
            <span>{filters.maxDistanceKm} km</span>
          </div>
          <Slider
            value={[filters.maxDistanceKm]}
            onValueChange={handleRadiusChange}
            min={10}
            max={500}
            step={10}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="space-y-3">
        {filteredCompetitions.map(competition => (
          <CompetitionCard 
            key={competition.id} 
            competition={competition}
            userLocation={userLocation}
          />
        ))}
      </div>
    </div>
  );
};

export default CompetitionList;
