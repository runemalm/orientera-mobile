import React, { useState, useMemo } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import CalendarList from '../components/competition/CalendarList';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Filter, CompetitionSummary } from '../types';
import { useQuery } from '@tanstack/react-query';
import { searchCompetitions } from '../services/api';
import { addMonths, startOfWeek, endOfWeek } from 'date-fns';
import { Loader2, AlertTriangle } from 'lucide-react';

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
  const [filters] = useLocalStorage<Filter>('competitionFilters', DEFAULT_FILTERS);
  const [fromDate, setFromDate] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [toDate, setToDate] = useState<Date>(endOfWeek(addMonths(new Date(), 6), { weekStartsOn: 1 }));

  const { data: competitions, isLoading, error } = useQuery({
    queryKey: ['competitions', filters, fromDate, toDate],
    queryFn: async () => {
      const shouldUseLocation = filters.useLocationFilter && filters.location !== undefined;
      const lat = shouldUseLocation ? filters.location?.latitude : undefined;
      const lng = shouldUseLocation ? filters.location?.longitude : undefined;
      const maxDistance = shouldUseLocation ? filters.maxDistanceKm : undefined;

      return await searchCompetitions(
        fromDate,
        toDate,
        lat,
        lng,
        maxDistance,
        undefined,
        filters.branches.length > 0 ? filters.branches : undefined,
        filters.disciplines.length > 0 ? filters.disciplines : undefined,
        filters.competitionTypes.length > 0 ? filters.competitionTypes : undefined,
        filters.districts.length > 0 ? filters.districts : undefined
      );
    },
  });

  const competitionCount = useMemo(() => {
    return competitions ? competitions.length : 0;
  }, [competitions]);

  if (isLoading) {
    return (
      <MobileLayout title="Kalender">
        <div className="flex flex-col justify-center items-center h-64 mt-4 space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-gray-500">Hämtar tävlingar...</p>
        </div>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout title="Kalender">
        <div className="flex flex-col items-center justify-center h-64 mt-8 px-4 text-center">
          <div className="bg-red-100 rounded-full p-4 mb-4">
            <AlertTriangle className="text-red-500 h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">Kunde inte hämta tävlingar</h2>
          <p className="text-gray-500 mt-2">
            Ett fel uppstod när tävlingarna skulle hämtas. Försök igen senare.
          </p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout 
      title="Kalender"
    >
      <div className="px-4 pt-2 pb-6">
        {competitions && (
          <CalendarList 
            competitions={competitions} 
            fromDate={fromDate}
            toDate={toDate}
          />
        )}
      </div>
    </MobileLayout>
  );
};

export default CompetitionsPage;
