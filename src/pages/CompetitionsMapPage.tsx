
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Filter, CompetitionSummary } from '../types';
import { useQuery } from '@tanstack/react-query';
import { searchCompetitions } from '../services/api';
import { Loader2, AlertTriangle } from 'lucide-react';
import CompetitionsMap from '../components/competition/CompetitionsMap';
import { addMonths, startOfWeek, endOfWeek } from 'date-fns';

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

const CompetitionsMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters] = useLocalStorage<Filter>('competitionFilters', DEFAULT_FILTERS);

  // Fetch competitions with current filters
  const { data: competitions, isLoading, error } = useQuery({
    queryKey: ['competitions-map', filters],
    queryFn: async () => {
      const now = new Date();
      const startDate = startOfWeek(now, { weekStartsOn: 1 });
      const sixMonthsFromNow = addMonths(now, 6);
      const endDate = endOfWeek(sixMonthsFromNow, { weekStartsOn: 1 });
      
      // Determine if we should include location parameters
      const shouldUseLocation = filters.useLocationFilter && filters.location !== undefined;
      const lat = shouldUseLocation ? filters.location?.latitude : undefined;
      const lng = shouldUseLocation ? filters.location?.longitude : undefined;
      const maxDistance = shouldUseLocation ? filters.maxDistanceKm : undefined;
      
      // Make API call with all appropriate filter parameters
      return searchCompetitions(
        startDate,
        endDate,
        lat,
        lng,
        maxDistance,
        undefined, // limit
        filters.branches.length > 0 ? filters.branches : undefined,
        filters.disciplines.length > 0 ? filters.disciplines : undefined,
        filters.competitionTypes.length > 0 ? filters.competitionTypes : undefined,
        filters.districts.length > 0 ? filters.districts : undefined
      );
    },
  });

  // Filter competitions that have valid coordinates
  const competitionsWithCoordinates = competitions?.filter(
    comp => comp.latitude && comp.longitude
  ) || [];

  // Calculate the number of competitions without coordinates
  const missingCoordinatesCount = competitions ? 
    competitions.length - competitionsWithCoordinates.length : 
    0;

  if (isLoading) {
    return (
      <MobileLayout title="Laddar..." showBackButton>
        <div className="flex flex-col justify-center items-center h-64 mt-4 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-500">Hämtar tävlingar...</p>
        </div>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout title="Fel" showBackButton>
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

  if (competitionsWithCoordinates.length === 0) {
    return (
      <MobileLayout title="Tävlingar på karta" showBackButton>
        <div className="flex flex-col items-center justify-center h-64 mt-8 px-4 text-center">
          <div className="bg-yellow-50 rounded-full p-4 mb-4">
            <AlertTriangle className="text-yellow-500 h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">Inga tävlingar att visa</h2>
          <p className="text-gray-500 mt-2">
            {competitions && competitions.length > 0 
              ? `Hittade ${competitions.length} tävlingar men ingen har platskoordinater.`
              : 'Inga tävlingar hittades med nuvarande filter.'}
          </p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Tävlingar på karta" showBackButton>
      {missingCoordinatesCount > 0 && (
        <div className="bg-yellow-50 px-4 py-2 text-sm mb-2">
          <p>
            Visar {competitionsWithCoordinates.length} tävlingar på kartan.
            {missingCoordinatesCount} tävlingar saknar koordinater och visas inte.
          </p>
        </div>
      )}
      <div className="h-[calc(100vh-64px)] -mx-4 relative">
        <CompetitionsMap competitions={competitionsWithCoordinates} />
      </div>
    </MobileLayout>
  );
};

export default CompetitionsMapPage;
