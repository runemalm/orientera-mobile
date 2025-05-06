
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Loader2, Info, Filter } from 'lucide-react';
import { CompetitionSummary } from '../types';
import { getNearbyCompetitions } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { addMonths, startOfWeek, endOfWeek } from 'date-fns';
import CompetitionLayout from '../components/competition/CompetitionLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { Link } from 'react-router-dom';

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
  const [showInfo, setShowInfo] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  // Force the calendar view by setting it directly in localStorage
  useEffect(() => {
    localStorage.setItem('competitionViewMode', 'calendar');
  }, []);

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
        branches: safeFilters.branches
      });

      const result = await getNearbyCompetitions(
        0, // Default latitude
        0, // Default longitude
        {
          from: startDate,
          to: endDate,
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

  const handleFilterClick = () => {
    setShowFilterOptions(true);
  };

  const handleAIFilterClick = () => {
    setShowFilterOptions(false);
    navigate('/assistant', { state: { initiateCompetitionSearch: true } });
  };

  const handleManualFilterClick = () => {
    setShowFilterOptions(false);
    navigate('/competition-filter');
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
          <Popover open={showFilterOptions} onOpenChange={setShowFilterOptions}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleFilterClick}
                className="text-muted-foreground"
              >
                <Filter className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-0">
              <div className="flex flex-col">
                <Button 
                  onClick={handleAIFilterClick}
                  className="justify-start rounded-none px-4 py-6 bg-forest-light hover:bg-forest text-white"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold">Filter med AI</span>
                    <span className="text-xs mt-1 opacity-90">Fråga på ditt sätt</span>
                  </div>
                </Button>
                <Button 
                  onClick={handleManualFilterClick}
                  className="justify-start rounded-none px-4 py-3"
                  variant="ghost"
                >
                  Filter manuellt
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        }
      >
        {renderContent()}
      </MobileLayout>

      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Om tävlingsvisning</DialogTitle>
            <DialogDescription className="space-y-3 pt-3">
              <p>
                Här kan du se kommande orienteringstävlingar som är relevanta för dig.
              </p>
              <p>
                Du kan använda vår smarta assistent för att hitta specifika tävlingar. 
              </p>
              <ul className="list-disc pl-4 space-y-2">
                <li>"Visa tävlingar i Skåne"</li>
                <li>"Hitta stafetter i juni"</li>
                <li>"Visa medeldistanstävlingar nära Göteborg"</li>
              </ul>
              <p>
                Använd filtreringsalternativen för att anpassa dina sökresultat ännu mer.
              </p>
              <div className="mt-4 text-center">
                <Link 
                  to="/assistant" 
                  className="text-primary hover:underline font-semibold"
                  onClick={() => setShowInfo(false)}
                >
                  Öppna tävlingsassistenten
                </Link>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompetitionsPage;
