
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Filter } from '../../types';
import { formatDateShort } from '../../utils/dateUtils';

interface FilterBubblesProps {
  filters: Filter;
  onRemoveFilter: (filterType: string, value?: string) => void;
}

// Converts filter names to friendly Swedish display names
const getFilterDisplayName = (filterType: string, value: string): string => {
  const translations: Record<string, Record<string, string>> = {
    districts: {
      Blekinge: 'Blekinge',
      Bohuslan: 'Bohuslän',
      Dalarna: 'Dalarna',
      Gotland: 'Gotland',
      Gastrikland: 'Gästrikland',
      Goteborg: 'Göteborg',
      Halland: 'Halland',
      Halsingland: 'Hälsingland',
      JamtlandHarjedalen: 'Jämtland-Härjedalen',
      Medelpad: 'Medelpad',
      Norrbotten: 'Norrbotten',
      Skane: 'Skåne',
      Smaland: 'Småland',
      Stockholm: 'Stockholm',
      Sodermanland: 'Södermanland',
      Uppland: 'Uppland',
      Varmland: 'Värmland',
      Vasterbotten: 'Västerbotten',
      Vastergotland: 'Västergötland',
      Vastmanland: 'Västmanland',
      Angermanland: 'Ångermanland',
      OrebroLan: 'Örebro län',
      Ostergotland: 'Östergötland'
    },
    disciplines: {
      Sprint: 'Sprint',
      Middle: 'Medel',
      Long: 'Lång',
      Night: 'Natt',
      Relay: 'Stafett',
      UltraLong: 'Ultralång',
      PreO: 'PreO',
      TempO: 'TempO'
    },
    competitionTypes: {
      Championship: 'Mästerskap',
      National: 'Nationell',
      Regional: 'Regional',
      Near: 'Närtävling',
      Club: 'Klubbtävling',
      Weekly: 'Veckotävling'
    },
    branches: {
      FootO: 'Fot-OL',
      PreO: 'PreO',
      MTBO: 'MTBO',
      SkiO: 'Skid-OL',
      TrailO: 'Trail-O'
    },
    dateRange: {
      dateRange: 'Datum'
    },
    location: {
      location: 'Plats'
    }
  };
  
  return translations[filterType]?.[value] || value;
};

const FilterBubbles: React.FC<FilterBubblesProps> = ({ filters, onRemoveFilter }) => {
  const hasAnyFilter = 
    filters.districts.length > 0 || 
    filters.disciplines.length > 0 ||
    filters.competitionTypes.length > 0 ||
    filters.branches.length > 0 ||
    filters.dateRange.from !== null ||
    filters.dateRange.to !== null ||
    filters.useLocationFilter;
    
  if (!hasAnyFilter) {
    return null;
  }

  return (
    <div className="px-4 pt-3 pb-0 flex flex-wrap gap-1.5">
      {/* District bubbles */}
      {filters.districts.map(district => (
        <Badge 
          key={`district-${district}`}
          variant="outline"
          className="bg-white flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-medium text-gray-700 border-gray-200"
        >
          {getFilterDisplayName('districts', district)}
          <X 
            className="h-3 w-3 text-gray-500 cursor-pointer" 
            onClick={() => onRemoveFilter('districts', district)}
          />
        </Badge>
      ))}
      
      {/* Branch bubbles */}
      {filters.branches.map(branch => (
        <Badge 
          key={`branch-${branch}`}
          variant="outline"
          className="bg-white flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-medium text-gray-700 border-gray-200"
        >
          {getFilterDisplayName('branches', branch)}
          <X 
            className="h-3 w-3 text-gray-500 cursor-pointer" 
            onClick={() => onRemoveFilter('branches', branch)}
          />
        </Badge>
      ))}
      
      {/* Discipline bubbles */}
      {filters.disciplines.map(discipline => (
        <Badge 
          key={`discipline-${discipline}`}
          variant="outline"
          className="bg-white flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-medium text-gray-700 border-gray-200"
        >
          {getFilterDisplayName('disciplines', discipline)}
          <X 
            className="h-3 w-3 text-gray-500 cursor-pointer" 
            onClick={() => onRemoveFilter('disciplines', discipline)}
          />
        </Badge>
      ))}
      
      {/* Competition Type bubbles */}
      {filters.competitionTypes.map(type => (
        <Badge 
          key={`type-${type}`}
          variant="outline"
          className="bg-white flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-medium text-gray-700 border-gray-200"
        >
          {getFilterDisplayName('competitionTypes', type)}
          <X 
            className="h-3 w-3 text-gray-500 cursor-pointer" 
            onClick={() => onRemoveFilter('competitionTypes', type)}
          />
        </Badge>
      ))}
      
      {/* Date Range bubble */}
      {(filters.dateRange.from || filters.dateRange.to) && (
        <Badge 
          variant="outline"
          className="bg-white flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-medium text-gray-700 border-gray-200"
        >
          {filters.dateRange.from && filters.dateRange.to 
            ? `${formatDateShort(filters.dateRange.from)} - ${formatDateShort(filters.dateRange.to)}`
            : filters.dateRange.from 
              ? `Från ${formatDateShort(filters.dateRange.from)}` 
              : `Till ${formatDateShort(filters.dateRange.to!)}`
          }
          <X 
            className="h-3 w-3 text-gray-500 cursor-pointer" 
            onClick={() => onRemoveFilter('dateRange')}
          />
        </Badge>
      )}
      
      {/* Location filter bubble */}
      {filters.useLocationFilter && filters.location && (
        <Badge 
          variant="outline"
          className="bg-white flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-medium text-gray-700 border-gray-200"
        >
          {`${filters.location.city} (${filters.maxDistanceKm} km)`}
          <X 
            className="h-3 w-3 text-gray-500 cursor-pointer" 
            onClick={() => onRemoveFilter('location')}
          />
        </Badge>
      )}
    </div>
  );
};

export default FilterBubbles;
