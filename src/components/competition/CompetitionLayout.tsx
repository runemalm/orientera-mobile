
import React, { useRef, useEffect } from 'react';
import { CompetitionSummary } from '../../types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import CalendarList from './CalendarList';
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
  const [viewMode, setViewMode] = useLocalStorage<'calendar' | 'map'>('competitionViewMode', 'calendar');
  const [calendarScrollPosition, setCalendarScrollPosition] = useLocalStorage<number>('calendarScrollPosition', 0);
  
  const calendarScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const saveScrollPosition = () => {
    if (viewMode === 'calendar' && calendarScrollRef.current) {
      setCalendarScrollPosition(calendarScrollRef.current.scrollTop);
    }
  };

  const handleTabChange = (value: string) => {
    saveScrollPosition();
    setViewMode(value as 'calendar' | 'map');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (viewMode === 'calendar' && calendarScrollRef.current) {
        calendarScrollRef.current.scrollTop = calendarScrollPosition;
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      saveScrollPosition();
    };
  }, [viewMode, calendarScrollPosition]);

  return (
    <div className="flex flex-col h-full mt-4">
      {!hideTabBar && (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-2 pb-2 px-2">
          <Tabs value={viewMode} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calendar">Kalender</TabsTrigger>
              <TabsTrigger value="map">Karta</TabsTrigger>
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
      </div>
    </div>
  );
};

export default CompetitionLayout;
