
import React, { useRef, useEffect } from 'react';
import { CompetitionSummary } from '../../types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import CalendarList from './CalendarList';
import CompetitionPageFavorites from './CompetitionPageFavorites';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ScrollArea } from '../ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import CompetitionsMapView from './CompetitionsMapView';

interface CompetitionLayoutProps {
  competitions: CompetitionSummary[];
  fromDate: Date;
  toDate: Date;
  hideTabBar?: boolean;
}

const CompetitionLayout: React.FC<CompetitionLayoutProps> = ({
  competitions,
  fromDate,
  toDate,
  hideTabBar = false
}) => {
  const [viewMode, setViewMode] = useLocalStorage<'calendar' | 'favorites' | 'map'>('competitionViewMode', 'calendar');
  const [calendarScrollPosition, setCalendarScrollPosition] = useLocalStorage<number>('calendarScrollPosition', 0);
  const [favoritesScrollPosition, setFavoritesScrollPosition] = useLocalStorage<number>('favoritesScrollPosition', 0);
  
  const calendarScrollRef = useRef<HTMLDivElement>(null);
  const favoritesScrollRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();

  const saveScrollPosition = () => {
    if (viewMode === 'calendar' && calendarScrollRef.current) {
      setCalendarScrollPosition(calendarScrollRef.current.scrollTop);
    } else if (viewMode === 'favorites' && favoritesScrollRef.current) {
      setFavoritesScrollPosition(favoritesScrollRef.current.scrollTop);
    }
  };

  const handleTabChange = (value: string) => {
    saveScrollPosition();
    setViewMode(value as 'calendar' | 'favorites' | 'map');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (viewMode === 'calendar' && calendarScrollRef.current) {
        calendarScrollRef.current.scrollTop = calendarScrollPosition;
      } else if (viewMode === 'favorites' && favoritesScrollRef.current) {
        favoritesScrollRef.current.scrollTop = favoritesScrollPosition;
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      saveScrollPosition();
    };
  }, [viewMode, calendarScrollPosition, favoritesScrollPosition]);

  return (
    <div className="flex flex-col h-full mt-4">
      {!hideTabBar && (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-2 pb-2 px-2">
          <Tabs value={viewMode} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calendar">Kalender</TabsTrigger>
              <TabsTrigger value="map">Karta</TabsTrigger>
              <TabsTrigger value="favorites">Favoriter</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      <div className="flex-1 relative">
        <div 
          className={`absolute inset-0 ${viewMode === 'calendar' ? 'block' : 'hidden'} overflow-auto`}
          ref={calendarScrollRef}
        >
          <div className="px-2 pt-0 pb-8">
            <CalendarList
              competitions={competitions}
              fromDate={fromDate}
              toDate={toDate}
            />
          </div>
        </div>
        
        <div 
          className={`absolute inset-0 ${viewMode === 'map' ? 'block' : 'hidden'}`}
        >
          <CompetitionsMapView competitions={competitions} />
        </div>
        
        <div 
          className={`absolute inset-0 ${viewMode === 'favorites' ? 'block' : 'hidden'} overflow-auto`}
          ref={favoritesScrollRef}
        >
          <div className="px-2 pt-0 pb-4">
            <CompetitionPageFavorites competitions={competitions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionLayout;
