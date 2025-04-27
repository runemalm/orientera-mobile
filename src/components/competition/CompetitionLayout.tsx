import React, { useRef, useEffect } from 'react';
import { CompetitionSummary } from '../../types';
import { UserLocation } from '../../hooks/useUserLocation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import CalendarList from './CalendarList';
import CompetitionList from './CompetitionList';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ScrollArea } from '../ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompetitionLayoutProps {
  competitions: CompetitionSummary[];
  userLocation: UserLocation | null;
  fromDate: Date;
  toDate: Date;
}

const CompetitionLayout: React.FC<CompetitionLayoutProps> = ({
  competitions,
  userLocation,
  fromDate,
  toDate
}) => {
  const [viewMode, setViewMode] = useLocalStorage<'calendar' | 'list'>('competitionViewMode', 'calendar');
  const [calendarScrollPosition, setCalendarScrollPosition] = useLocalStorage<number>('calendarScrollPosition', 0);
  const [listScrollPosition, setListScrollPosition] = useLocalStorage<number>('listScrollPosition', 0);
  
  const calendarScrollRef = useRef<HTMLDivElement>(null);
  const listScrollRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const saveScrollPosition = () => {
    if (viewMode === 'calendar' && calendarScrollRef.current) {
      setCalendarScrollPosition(calendarScrollRef.current.scrollTop);
    } else if (viewMode === 'list' && listScrollRef.current) {
      setListScrollPosition(listScrollRef.current.scrollTop);
    }
  };

  const handleTabChange = (value: string) => {
    saveScrollPosition();
    setViewMode(value as 'calendar' | 'list');
  };

  const handleFilterClick = () => {
    navigate('/competitions/filter', { 
      state: { 
        transition: 'slide' 
      }
    });
  };

  const handleSetLocationClick = () => {
    setViewMode('list');
    navigate('/competitions/filter', { 
      state: { 
        transition: 'slide' 
      }
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (viewMode === 'calendar' && calendarScrollRef.current) {
        calendarScrollRef.current.scrollTop = calendarScrollPosition;
      } else if (viewMode === 'list' && listScrollRef.current) {
        listScrollRef.current.scrollTop = listScrollPosition;
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      saveScrollPosition();
    };
  }, [viewMode, calendarScrollPosition, listScrollPosition]);

  const renderListContent = () => {
    if (!userLocation) {
      return (
        <div className="px-4 py-8 text-center">
          <div className="mb-6">
            <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
              <MapPin className="h-8 w-8 text-forest" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">Hitta tävlingar nära dig</h3>
          <p className="text-gray-500 mb-6 max-w-xs mx-auto">
            För att se tävlingar i ditt närområde behöver du ange din plats
          </p>
          <Button 
            onClick={handleSetLocationClick}
            className="w-full max-w-xs bg-forest hover:bg-forest-dark"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Ange plats
          </Button>
        </div>
      );
    }

    return (
      <CompetitionList
        competitions={competitions}
        userLocation={userLocation}
      />
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-3 pb-2 px-2">
        <Tabs value={viewMode} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Kalender</TabsTrigger>
            <TabsTrigger value="list">Nära mig</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 relative">
        <div 
          className={`absolute inset-0 ${viewMode === 'calendar' ? 'block' : 'hidden'} overflow-auto`}
          ref={calendarScrollRef}
        >
          <div className="px-2 pt-0 pb-4">
            <CalendarList
              competitions={competitions}
              userLocation={userLocation}
              fromDate={fromDate}
              toDate={toDate}
            />
          </div>
        </div>
        
        <div 
          className={`absolute inset-0 ${viewMode === 'list' ? 'block' : 'hidden'} overflow-auto`}
          ref={listScrollRef}
        >
          <div className="px-2 pt-0 pb-4">
            {renderListContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionLayout;
