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
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const [showFilterSheet, setShowFilterSheet] = useState(false);

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
    setShowFilterSheet(true);
  };

  const handleAIFilterClick = () => {
    setShowFilterSheet(false);
    navigate('/ai-filtering');
  };

  const handleManualFilterClick = () => {
    setShowFilterSheet(false);
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
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleFilterClick}
            className="text-muted-foreground"
          >
            <Filter className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        }
      >
        {renderContent()}
      </MobileLayout>

      <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
        <SheetContent 
          side="bottom" 
          className="p-0 border-0 rounded-t-2xl max-h-fit"
          hideCloseButton
        >
          <div className="flex flex-col w-full bg-white rounded-t-2xl p-6">            
            <div className="mb-4">
              <Button 
                onClick={handleAIFilterClick}
                className="w-full justify-center py-8 bg-forest-light hover:bg-forest text-white rounded-xl flex items-center"
              >
                <span className="font-bold text-base">Filtrera med AI</span>
              </Button>
            </div>
            
            <div className="mb-6">
              <Button 
                onClick={handleManualFilterClick}
                className="w-full justify-center py-8 rounded-xl"
                variant="outline"
              >
                <span>Filtrera manuellt</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
