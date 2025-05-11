
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Loader2, Filter as FilterIcon } from 'lucide-react';
import { CompetitionSummary, Filter, OrienteeringDistrict, Discipline, CompetitionType, Branch } from '../types';
import { getNearbyCompetitions } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { addMonths, startOfWeek, endOfWeek } from 'date-fns';
import CompetitionLayout from '../components/competition/CompetitionLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FilterBubbles from '../components/filters/FilterBubbles';

const DEFAULT_FILTERS: Filter = {
  useLocationFilter: false,
  maxDistanceKm: 100,
  districts: [],
  disciplines: [],
  competitionTypes: [],
  branches: [],
  dateRange: {
    from: null,
    to: null
  }
};

const CompetitionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState<CompetitionSummary[]>([]);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useLocalStorage<Filter>('competitionFilters', DEFAULT_FILTERS);

  // Force the calendar view by setting it directly in localStorage
  useEffect(() => {
    localStorage.setItem('competitionViewMode', 'calendar');
  }, []);

  // Calculate active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    
    if (filters.districts.length > 0) count++;
    if (filters.disciplines.length > 0) count++;
    if (filters.competitionTypes.length > 0) count++;
    if (filters.branches.length > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.useLocationFilter) count++;
    
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const fetchCompetitions = useCallback(async () => {
    setIsLoadingCompetitions(true);
    setError(null);
    
    const safeFilters = filters || DEFAULT_FILTERS;
    
    const now = new Date();
    const currentDay = now.getDay();
    
    const startDate = startOfWeek(
      currentDay >= 1 && currentDay <= 3 
        ? new Date(now.setDate(now.getDate() - 7)) // Previous week
        : now, 
      { weekStartsOn: 1 } // Week starts on Monday
    );
    
    const sixMonthsFromNow = addMonths(now, 6);
    const endDate = endOfWeek(sixMonthsFromNow, { weekStartsOn: 1 });
    
    try {
      // Determine if we should include location parameters
      const shouldUseLocation = safeFilters.useLocationFilter && safeFilters.location !== undefined;
      
      // Only include location parameters if location filtering is enabled AND we have location data
      const lat = shouldUseLocation ? safeFilters.location?.latitude : undefined;
      const lng = shouldUseLocation ? safeFilters.location?.longitude : undefined;
      const maxDistance = shouldUseLocation ? safeFilters.maxDistanceKm : undefined;
      
      console.log('Fetching competitions with filters:', {
        from: startDate,
        to: endDate,
        districts: safeFilters.districts,
        disciplines: safeFilters.disciplines,
        competitionTypes: safeFilters.competitionTypes,
        branches: safeFilters.branches,
        lat: lat,
        lng: lng,
        maxDistanceKm: maxDistance
      });

      // Make a single API call with all appropriate filter parameters
      const result = await getNearbyCompetitions(
        startDate,
        endDate,
        lat,
        lng,
        maxDistance,
        undefined, // limit
        safeFilters.branches.length > 0 ? safeFilters.branches : undefined,
        safeFilters.disciplines.length > 0 ? safeFilters.disciplines : undefined,
        safeFilters.competitionTypes.length > 0 ? safeFilters.competitionTypes : undefined,
        safeFilters.districts.length > 0 ? safeFilters.districts : undefined
      );
      
      console.log('Competitions fetched:', result.length);
      setCompetitions(result);
      
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setError('Det gick inte att hämta tävlingar. Försök igen senare.');
    } finally {
      setIsLoadingCompetitions(false);
    }
  }, [filters]);

  // Fetch competitions when the component mounts or filters change
  useEffect(() => {
    console.log('Fetching competitions due to filter change');
    fetchCompetitions();
  }, [fetchCompetitions]);

  const handleFilterClick = () => {
    // Navigate directly to manual filtering page
    navigate('/manual-filtering');
  };

  // Handle removing a filter
  const handleRemoveFilter = (filterType: string, value?: string) => {
    // Create a copy of current filters
    const updatedFilters = { ...filters };
    
    // Handle removing different types of filters
    switch (filterType) {
      case 'districts':
        if (value) {
          updatedFilters.districts = filters.districts.filter(item => item !== value);
        } else {
          updatedFilters.districts = [];
        }
        break;
      case 'disciplines':
        if (value) {
          updatedFilters.disciplines = filters.disciplines.filter(item => item !== value);
        } else {
          updatedFilters.disciplines = [];
        }
        break;
      case 'competitionTypes':
        if (value) {
          updatedFilters.competitionTypes = filters.competitionTypes.filter(item => item !== value);
        } else {
          updatedFilters.competitionTypes = [];
        }
        break;
      case 'branches':
        if (value) {
          updatedFilters.branches = filters.branches.filter(item => item !== value);
        } else {
          updatedFilters.branches = [];
        }
        break;
      case 'dateRange':
        updatedFilters.dateRange = { from: null, to: null };
        break;
      case 'location':
        updatedFilters.useLocationFilter = false;
        break;
      default:
        break;
    }
    
    // Update filters
    setFilters(updatedFilters);
  };

  const renderContent = () => {
    if (isLoadingCompetitions && competitions.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-gray-600">Laddar...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">{error}</p>
        </div>
      );
    }

    const safeFilters = filters || DEFAULT_FILTERS;
    const dateRange = safeFilters.dateRange || { from: null, to: null };
    
    const fromDate = dateRange.from 
      ? dateRange.from 
      : startOfWeek(new Date(), { weekStartsOn: 1 });
    
    const toDate = dateRange.to || (() => {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      return date;
    })();

    return (
      <div className="flex flex-col h-full">
        {/* Add filter bubbles above the competition list */}
        <FilterBubbles 
          filters={filters} 
          onRemoveFilter={handleRemoveFilter} 
        />
        
        <div className={`flex-1 ${activeFiltersCount > 0 ? 'pt-1' : 'pt-2'}`}>
          <CompetitionLayout
            competitions={competitions}
            fromDate={fromDate}
            toDate={toDate}
            hideTabBar={true} // Hide the tabs
          />
        </div>
      </div>
    );
  };

  return (
    <MobileLayout 
      title="Tävlingar" 
      fullHeight
      action={
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleFilterClick}
            className="text-muted-foreground"
          >
            <FilterIcon className="h-[1.2rem] w-[1.2rem]" />
            {activeFiltersCount > 0 && (
              <Badge 
                variant="default" 
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] font-bold"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      }
    >
      {renderContent()}
    </MobileLayout>
  );
};

export default CompetitionsPage;
