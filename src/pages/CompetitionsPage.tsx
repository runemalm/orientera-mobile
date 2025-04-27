
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Loader2 } from 'lucide-react';
import { CompetitionSummary } from '../types';
import { getNearbyCompetitions } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { addMonths, startOfWeek, endOfWeek, isSameWeek } from 'date-fns';
import CompetitionLayout from '../components/competition/CompetitionLayout';

interface Filter {
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
  const [filters] = useLocalStorage<Filter>('competitionFilters', DEFAULT_FILTERS);

  const fetchCompetitions = useCallback(async () => {
    setIsLoadingCompetitions(true);
    setError(null);
    
    const safeFilters = filters || DEFAULT_FILTERS;
    
    // Get current date and day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const now = new Date();
    const currentDay = now.getDay();
    
    // If it's Monday (1), Tuesday (2), or Wednesday (3), start from previous week
    const startDate = startOfWeek(
      currentDay >= 1 && currentDay <= 3 
        ? new Date(now.setDate(now.getDate() - 7)) // Previous week
        : now, 
      { weekStartsOn: 1 } // Week starts on Monday
    );
    
    // End date is the end of the week 6 months from now
    const sixMonthsFromNow = addMonths(now, 6);
    const endDate = endOfWeek(sixMonthsFromNow, { weekStartsOn: 1 });
    
    try {
      console.log('Fetching competitions with filters:', {
        from: startDate,
        to: endDate,
        districts: safeFilters.districts,
        disciplines: safeFilters.disciplines,
        competitionTypes: safeFilters.competitionTypes,
        branches: safeFilters.branches
      });

      const result = await getNearbyCompetitions(
        0, // Default latitude
        0, // Default longitude
        {
          from: startDate,
          to: endDate,
          limit: 50,
          districts: safeFilters.districts.length > 0 ? safeFilters.districts : undefined,
          disciplines: safeFilters.disciplines.length > 0 ? safeFilters.disciplines : undefined,
          competitionTypes: safeFilters.competitionTypes.length > 0 ? safeFilters.competitionTypes : undefined,
          branches: safeFilters.branches.length > 0 ? safeFilters.branches : undefined
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
  }, [filters]);

  useEffect(() => {
    console.log('Initial fetch triggered');
    fetchCompetitions();
  }, [fetchCompetitions]);

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
        hideTabBar
      />
    );
  };

  return (
    <MobileLayout 
      title="Hitta Tävlingar" 
      fullHeight
    >
      {renderContent()}
    </MobileLayout>
  );
};

export default CompetitionsPage;

