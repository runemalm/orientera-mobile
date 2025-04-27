
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Loader2, X } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

interface LocationInputFormProps {
  onLocationSelected: (location: { city: string; latitude: number; longitude: number }) => void;
  onCancel?: () => void;
}

interface LocationSuggestion {
  displayName: string;
  lat: number;
  lon: number;
  placeId: number;
  locationName: string;
}

const LocationInputForm: React.FC<LocationInputFormProps> = ({ onLocationSelected, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (debouncedSearchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsSearching(true);
      setError(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            debouncedSearchTerm
          )}&format=json&addressdetails=1&limit=5&countrycodes=se`,
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
        
        const parsedSuggestions = data.map((item: any) => {
          let locationName = '';
          
          if (item.address.city || item.address.town || item.address.village) {
            locationName = item.address.city || item.address.town || item.address.village;
          } else if (item.display_name) {
            locationName = item.display_name.split(',')[0];
          } else {
            locationName = debouncedSearchTerm;
          }
          
          return {
            displayName: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            placeId: parseInt(item.place_id),
            locationName
          };
        });
        
        setSuggestions(parsedSuggestions);
        setShowSuggestions(parsedSuggestions.length > 0);
      } catch (err) {
        setError('Ett fel uppstod vid sökning');
        console.error('Error searching location:', err);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm]);

  // Hide suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setError('Vänligen ange en plats');
      return;
    }

    setIsSearching(true);
    setError(null);
    
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        searchTerm
      )}&format=json&addressdetails=1&limit=1&countrycodes=se`,
      {
        headers: {
          'Accept-Language': 'sv',
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Något gick fel vid sökning');
        }
        return response.json();
      })
      .then((data) => {
        if (data.length === 0) {
          setError('Kunde inte hitta platsen');
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
      })
      .catch((err) => {
        setError('Ett fel uppstod vid sökning');
        console.error('Error searching location:', err);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  const selectSuggestion = (suggestion: LocationSuggestion) => {
    onLocationSelected({
      city: suggestion.locationName,
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    });
    setShowSuggestions(false);
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

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const popularCities = ["Stockholm", "Göteborg", "Malmö", "Uppsala", "Kalmar", "Umeå"];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 relative">
        <MapPin className="text-forest flex-shrink-0" size={20} />
        <div className="flex-1 relative">
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value) {
                setShowSuggestions(true);
              }
            }}
            placeholder="Skriv en plats"
            className="pr-8"
            onKeyDown={handleKeyPress}
            autoFocus
          />
          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={clearSearch}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
          className="bg-forest hover:bg-forest-dark"
        >
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sök"}
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef} 
          className="bg-white rounded-md shadow-md border border-gray-200 max-h-72 overflow-y-auto z-20"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.placeId}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-start gap-2"
              onClick={() => selectSuggestion(suggestion)}
            >
              <MapPin size={16} className="text-forest mt-1 flex-shrink-0" />
              <div className="truncate">
                <div>{suggestion.locationName}</div>
                <div className="text-xs text-gray-500 truncate">{suggestion.displayName}</div>
              </div>
            </div>
          ))}
        </div>
      )}

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
