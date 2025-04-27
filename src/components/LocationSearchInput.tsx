
import React, { useState, useEffect, useRef } from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationResult {
  city: string;
  latitude: number;
  longitude: number;
  display_name: string;
}

interface LocationSearchInputProps {
  onLocationSelected: (location: { city: string; latitude: number; longitude: number }) => void;
  currentCity?: string;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ onLocationSelected, currentCity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [showEmpty, setShowEmpty] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setShowEmpty(false);
      return;
    }

    setIsSearching(true);
    setShowEmpty(true);
    setIsOpen(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          term
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
      
      const formattedResults = data.map((item: any) => ({
        city: item.address.city || item.address.town || item.address.village || item.display_name.split(',')[0],
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        display_name: item.display_name
      }));

      setResults(formattedResults);
      console.log("Search results:", formattedResults);
    } catch (err) {
      console.error('Error searching locations:', err);
      setResults([]);
    }

    setIsSearching(false);
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(searchTerm);
      }, 500); // Debounce for 500ms
    } else if (searchTerm.length === 0) {
      setResults([]);
      setShowEmpty(false);
      setIsOpen(false);
    } else {
      setResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    // When results are available, ensure dropdown is shown
    if (results.length > 0) {
      setIsOpen(true);
    }
  }, [results]);

  const popularCities = [
    "Stockholm", "Göteborg", "Malmö", "Uppsala", "Kalmar", "Umeå"
  ];

  return (
    <div className="space-y-4">
      <Command className="rounded-lg border shadow-md overflow-visible">
        <div className="flex items-center border-b px-3">
          <MapPin className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <CommandInput
            placeholder="Sök plats..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="flex-1"
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
          />
          {isSearching && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </div>
        {(isOpen || showEmpty) && (
          <CommandList className="max-h-[300px] overflow-y-auto">
            {showEmpty && results.length === 0 && !isSearching && (
              <CommandEmpty>Inga resultat hittades</CommandEmpty>
            )}
            {results.length > 0 && (
              <CommandGroup heading="Sökresultat">
                {results.map((result, index) => (
                  <CommandItem
                    key={index}
                    className="cursor-pointer py-2 px-2 text-sm"
                    onSelect={() => {
                      onLocationSelected({
                        city: result.city,
                        latitude: result.latitude,
                        longitude: result.longitude,
                      });
                      setSearchTerm('');
                      setResults([]);
                      setShowEmpty(false);
                      setIsOpen(false);
                    }}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="truncate">{result.display_name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>

      <div className="grid grid-cols-3 gap-2">
        {popularCities.map((city) => (
          <Button
            key={city}
            variant="outline"
            size="sm"
            onClick={() => handleSearch(city)}
            className="justify-center"
          >
            {city}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LocationSearchInput;
