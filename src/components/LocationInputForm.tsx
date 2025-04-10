
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
      // Using the OpenStreetMap Nominatim API
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
        setError('Kunde inte hitta platsen. Försök med en annan sökning.');
        setIsSearching(false);
        return;
      }

      const result = data[0];
      
      // Create a more readable location name from the address components
      const address = result.address;
      let locationName = '';
      
      // Check if there's a road (street) in the address
      if (address.road) {
        // If it's a street address, format it with street and number
        locationName += address.road;
        if (address.house_number) {
          locationName += ' ' + address.house_number;
        }
        
        // Add city information
        if (address.city || address.town || address.village) {
          const cityName = address.city || address.town || address.village;
          locationName += ', ' + cityName;
        }
      }
      // If no road but city/town/village exists
      else if (address.city || address.town || address.village) {
        const cityName = address.city || address.town || address.village;
        const county = address.county;
        
        // Format as "city, county" if county exists
        if (county) {
          locationName = `${cityName}, ${county}`;
        } else {
          locationName = cityName;
        }
      } else if (result.name) {
        locationName = result.name;
      }
      
      // If we couldn't build a nice name, fallback to the display_name
      if (!locationName) {
        locationName = result.display_name;
      }
      
      onLocationSelected({
        city: locationName,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      });
      
    } catch (err) {
      setError('Ett fel uppstod vid sökning av platsen. Försök igen.');
      console.error('Error searching location:', err);
    }

    setIsSearching(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ange ort, t.ex. Stockholm"
          className="flex-1 focus-visible:ring-location"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
          className="bg-location hover:bg-location-dark"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-sm text-gray-500">
        <p>Ange en ort för att hitta närliggande orienteringstävlingar.</p>
      </div>

      {onCancel && (
        <Button variant="outline" onClick={onCancel} className="w-full mt-2">
          Avbryt
        </Button>
      )}
    </div>
  );
};

export default LocationInputForm;
