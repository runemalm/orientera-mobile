
import React, { useState, useEffect, useRef } from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
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
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Clear results when component is unmounted or when navigating
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      setResults([]);
      setSearchTerm('');
      setShowResults(false);
    };
  }, []);

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          term
        )}&format=json&addressdetails=1&limit=5&countrycodes=se`,
        {
          headers: {
            'Accept-Language': 'sv',
          },
          // Add cache control to prevent caching issues
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error('Något gick fel vid sökning');
      }

      const data = await response.json();
      
      // Only update results if this is still the current search term
      if (searchTerm === term) {
        const formattedResults = data.map((item: any) => ({
          city: item.address.city || item.address.town || item.address.village || item.display_name.split(',')[0],
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          display_name: item.display_name
        }));

        console.log("Search results:", formattedResults);
        setResults(formattedResults);
        // Ensure we show results even if the array is empty (to show the "No results" message)
        setShowResults(true);
      }
    } catch (err) {
      console.error('Error searching locations:', err);
      if (searchTerm === term) {
        setResults([]);
      }
    }

    setIsSearching(false);
  };

  useEffect(() => {
    // Clear any pending search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Reset results when search term is cleared
    if (searchTerm.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }
    
    // Debounce search to avoid making too many requests
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  return (
    <div className="w-full">
      <Command className="rounded-lg border shadow-md">
        <div className="flex items-center border-b px-3">
          <MapPin className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <CommandInput
            placeholder="Sök plats..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="flex-1"
          />
          {isSearching && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </div>
        
        <CommandList className="max-h-[300px] overflow-y-auto">
          {showResults && (
            results.length === 0 && !isSearching ? (
              <CommandEmpty>Inga resultat hittades</CommandEmpty>
            ) : (
              <CommandGroup>
                {results.map((result, index) => (
                  <CommandItem
                    key={`${result.city}-${result.latitude}-${result.longitude}-${index}`}
                    className="cursor-pointer py-2 px-2 text-sm"
                    onSelect={() => {
                      onLocationSelected({
                        city: result.city,
                        latitude: result.latitude,
                        longitude: result.longitude,
                      });
                      setSearchTerm('');
                      setResults([]);
                      setShowResults(false);
                    }}
                    value={result.display_name}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="truncate">{result.display_name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          )}
        </CommandList>
      </Command>
    </div>
  );
};

export default LocationSearchInput;
