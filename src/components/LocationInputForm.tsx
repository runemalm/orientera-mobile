
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
      onLocationSelected({
        city: result.display_name.split(',')[0],
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
          className="flex-1"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
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
