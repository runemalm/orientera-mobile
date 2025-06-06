import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Loader2 } from 'lucide-react';

interface LocationInputFormProps {
  onLocationSelected: (location: { city: string; latitude: number; longitude: number }) => void;
  onCancel?: () => void;
}

const LocationInputForm: React.FC<LocationInputFormProps> = ({ onLocationSelected, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Vänligen ange en plats');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchTerm
        )}&format=json&addressdetails=1&limit=1&countrycodes=se`,
        {
          headers: {
            'Accept-Language': 'sv',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Något gick fel vid sökning');
      }

      const data = await response.json();

      if (data.length === 0) {
        setError('Kunde inte hitta platsen');
        setIsSearching(false);
        return;
      }

      const result = data[0];
      
      let locationName = '';
      
      if (result.address.city || result.address.town || result.address.village) {
        locationName = result.address.city || result.address.town || result.address.village;
      } else if (result.display_name) {
        locationName = result.display_name.split(',')[0];
      } else {
        locationName = searchTerm;
      }
      
      onLocationSelected({
        city: locationName,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      });
      
    } catch (err) {
      setError('Ett fel uppstod vid sökning');
      console.error('Error searching location:', err);
    }

    setIsSearching(false);
  };

  const quickSelectCity = async (city: string) => {
    setSearchTerm(city);
    setIsSearching(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          city
        )}&format=json&addressdetails=1&limit=1&countrycodes=se`,
        {
          headers: {
            'Accept-Language': 'sv',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Något gick fel vid sökning');
      }

      const data = await response.json();

      if (data.length === 0) {
        setError('Kunde inte hitta platsen');
        setIsSearching(false);
        return;
      }

      const result = data[0];
      
      onLocationSelected({
        city: city,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      });
      
    } catch (err) {
      setError('Ett fel uppstod vid sökning');
      console.error('Error searching city:', err);
    }
    
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const popularCities = ["Stockholm", "Göteborg", "Malmö", "Uppsala", "Kalmar", "Umeå"];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="text-forest flex-shrink-0" size={20} />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Skriv en plats"
          className="flex-1"
          onKeyDown={handleKeyPress}
          autoFocus
        />
        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
          className="bg-forest hover:bg-forest-dark"
        >
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sök"}
        </Button>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {onCancel && (
        <Button variant="outline" onClick={onCancel} className="w-full mt-2">
          Avbryt
        </Button>
      )}
      
      <div className="grid grid-cols-3 gap-2 mt-2">
        {popularCities.map((city) => (
          <Button
            key={city}
            variant="outline"
            size="sm"
            onClick={() => quickSelectCity(city)}
            className="justify-center"
          >
            {city}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LocationInputForm;
