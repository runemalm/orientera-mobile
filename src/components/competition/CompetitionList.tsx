import React, { useState, useEffect } from 'react';
import { Star, MapPin, Radius } from 'lucide-react';
import { CompetitionSummary } from '../../types';
import CompetitionCard from '../CompetitionCard';
import { UserLocation } from '../../hooks/useUserLocation';
import { Button } from '../ui/button';
import LocationInputForm from '../LocationInputForm';
import RadiusInputForm from '../RadiusInputForm';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface CompetitionListProps {
  competitions: CompetitionSummary[];
  userLocation: UserLocation | null;
  showFavorites?: boolean;
}

const CompetitionList: React.FC<CompetitionListProps> = ({ 
  competitions, 
  userLocation,
  showFavorites = false 
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [isChangingRadius, setIsChangingRadius] = useState(false);
  const [searchRadius, setSearchRadius] = useLocalStorage<number>('searchRadius', 100);
  
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

  const filteredCompetitions = showFavorites
    ? competitions.filter(comp => favorites.includes(comp.id))
    : competitions;

  const handleLocationSelected = (location: { city: string; latitude: number; longitude: number }) => {
    window.dispatchEvent(new CustomEvent('locationUpdated', { 
      detail: location 
    }));
    setIsChangingLocation(false);
  };

  const handleRadiusSelected = (radius: number) => {
    setSearchRadius(radius);
    setIsChangingRadius(false);
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

  if (isChangingRadius) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ändra sökradie</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsChangingRadius(false)}
          >
            Avbryt
          </Button>
        </div>
        <RadiusInputForm 
          initialRadius={searchRadius}
          onRadiusSelected={handleRadiusSelected}
          onCancel={() => setIsChangingRadius(false)}
        />
      </div>
    );
  }
    
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
      <div className="sticky top-0 pb-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsChangingLocation(true)}
            className="flex items-center gap-1 border-dashed text-muted-foreground"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>{userLocation.city}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsChangingRadius(true)}
            className="flex items-center gap-1 border-dashed text-muted-foreground"
          >
            <Radius className="h-3.5 w-3.5" />
            <span>{searchRadius} km</span>
          </Button>
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
