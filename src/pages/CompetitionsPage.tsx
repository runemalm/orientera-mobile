import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Loader2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserLocation } from '../hooks/useUserLocation';
import { CompetitionSummary } from '../types';
import { getNearbyCompetitions } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { startOfWeek } from 'date-fns';
import CompetitionLayout from '../components/competition/CompetitionLayout';

let cachedCompetitions: CompetitionSummary[] = [];

interface Filter {
  useLocationFilter: boolean;
  maxDistanceKm: number;
  districts: string[];
  disciplines: string[];
  competitionTypes: string[];
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
  dateRange: {
    from: null,
    to: null
  }
};

const CompetitionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userLocation, fallbackLocation, locationWasEverSet } = useUserLocation();
  const [competitions, setCompetitions] = useState<CompetitionSummary[]>(cachedCompetitions);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(cachedCompetitions.length === 0);
  const [error, setError] = useState<string | null>(null);
  const initialFetchCompleted = useRef(false);
  const [filters, setFilters] = useLocalStorage<Filter>('competitionFilters', DEFAULT_FILTERS);

  const fetchCompetitions = useCallback(async () => {
    let lat = null;
    let lng = null;
    if (filters?.useLocationFilter && userLocation) {
      lat = userLocation.latitude;
      lng = userLocation.longitude;
    } else if (filters?.useLocationFilter && !userLocation) {
      lat = fallbackLocation.latitude;
      lng = fallbackLocation.longitude;
    } else if (!filters?.useLocationFilter) {
      lat = null;
      lng = null;
    }

    setIsLoadingCompetitions(true);
    setError(null);

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

    try {
      let result: CompetitionSummary[] = [];

      if (lat !== null && lng !== null) {
        result = await getNearbyCompetitions(
          lat, lng,
          {
            from: fromDate,
            to: toDate,
            limit: 50,
            maxDistanceKm: safeFilters.useLocationFilter ? safeFilters.maxDistanceKm : undefined,
            districts: safeFilters.districts.length > 0 ? safeFilters.districts : undefined,
            disciplines: safeFilters.disciplines.length > 0 ? safeFilters.disciplines : undefined,
            competitionTypes: safeFilters.competitionTypes.length > 0 ? safeFilters.competitionTypes : undefined
          }
        );
      } else {
        result = await getNearbyCompetitions(
          fallbackLocation.latitude,
          fallbackLocation.longitude,
          {
            from: fromDate,
            to: toDate,
            limit: 50,
            districts: safeFilters.districts.length > 0 ? safeFilters.districts : undefined,
            disciplines: safeFilters.disciplines.length > 0 ? safeFilters.disciplines : undefined,
            competitionTypes: safeFilters.competitionTypes.length > 0 ? safeFilters.competitionTypes : undefined
          }
        );
      }

      setCompetitions(result);
      cachedCompetitions = result;
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setError('Det gick inte att hämta tävlingar. Försök igen senare.');
    } finally {
      setIsLoadingCompetitions(false);
    }
  }, [userLocation, fallbackLocation, filters]);

  useEffect(() => {
    if (!initialFetchCompleted.current || cachedCompetitions.length === 0) {
      fetchCompetitions();
      initialFetchCompleted.current = true;
    }
  }, [userLocation, filters, fetchCompetitions]);

  const handleFilterClick = () => {
    navigate('/competitions/filter', { state: { transition: 'slide' } });
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

    const mapUserLocation = userLocation || fallbackLocation;

    return (
      <CompetitionLayout
        competitions={competitions}
        userLocation={mapUserLocation}
        fromDate={fromDate}
        toDate={toDate}
      />
    );
  };

  return (
    <MobileLayout
      title="Hitta Tävlingar"
      action={
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFilterClick}
        >
          <Filter className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      }
      fullHeight
    >
      {renderContent()}
    </MobileLayout>
  );
};

export default CompetitionsPage;
