
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Loader2, Filter } from 'lucide-react';
import { CompetitionSummary } from '../types';
import { getNearbyCompetitions } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { addMonths, startOfWeek, endOfWeek } from 'date-fns';
import CompetitionLayout from '../components/competition/CompetitionLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserLocation } from '../hooks/useUserLocation';

interface FilterProps {
  useLocationFilter: boolean;
  maxDistanceKm: number;
  districts: string[];
  disciplines: string[];
  competitionTypes: string[];
  branches: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

const DEFAULT_FILTERS: FilterProps = {
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
  const [filters] = useLocalStorage<FilterProps>('competitionFilters', DEFAULT_FILTERS);
  const { userLocation } = useUserLocation();

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
      console.log('Fetching competitions with filters:', {
        from: startDate,
        to: endDate,
        districts: safeFilters.districts,
        disciplines: safeFilters.disciplines,
        competitionTypes: safeFilters.competitionTypes,
        branches: safeFilters.branches,
        maxDistanceKm: safeFilters.useLocationFilter ? safeFilters.maxDistanceKm : undefined
      });

      // Determine if we should use location in the API call
      let lat = 0;
      let lng = 0;
      
      if (safeFilters.useLocationFilter && userLocation) {
        lat = userLocation.latitude;
        lng = userLocation.longitude;
      }

      const result = await getNearbyCompetitions(
        lat,
        lng,
        {
          from: startDate,
          to: endDate,
          districts: safeFilters.districts.length > 0 ? safeFilters.districts : undefined,
          disciplines: safeFilters.disciplines.length > 0 ? safeFilters.disciplines : undefined,
          competitionTypes: safeFilters.competitionTypes.length > 0 ? safeFilters.competitionTypes : undefined,
          branches: safeFilters.branches.length > 0 ? safeFilters.branches : undefined,
          maxDistanceKm: safeFilters.useLocationFilter ? safeFilters.maxDistanceKm : undefined
        }
      );
      
      console.log('Competitions fetched:', result.length);
      setCompetitions(result);
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setError('Det gick inte att hämta tävlingar. Försök igen senare.');
    } finally {
      setIsLoadingCompetitions(false);
    }
  }, [filters, userLocation]);

  useEffect(() => {
    console.log('Initial fetch triggered');
    fetchCompetitions();
  }, [fetchCompetitions]);

  const handleFilterClick = () => {
    // Navigate directly to manual filtering page
    navigate('/manual-filtering');
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
      <CompetitionLayout
        competitions={competitions}
        fromDate={fromDate}
        toDate={toDate}
        hideTabBar={true} // Hide the tabs
      />
    );
  };

  return (
    <>
      <MobileLayout 
        title="Tävlingskalender" 
        fullHeight
        action={
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleFilterClick}
              className="text-muted-foreground"
            >
              <Filter className="h-[1.2rem] w-[1.2rem]" />
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
    </>
  );
};

export default CompetitionsPage;
