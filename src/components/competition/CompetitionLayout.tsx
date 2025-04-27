
import React, { useRef, useEffect, useState } from 'react';
import { CompetitionSummary } from '../../types';
import { UserLocation } from '../../hooks/useUserLocation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import CalendarList from './CalendarList';
import CompetitionList from './CompetitionList';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface CompetitionLayoutProps {
  competitions: CompetitionSummary[];
  userLocation: UserLocation | null;
  fromDate: Date;
  toDate: Date;
  onViewModeChange?: (viewMode: 'calendar' | 'list') => void;
}

const CompetitionLayout: React.FC<CompetitionLayoutProps> = ({
  competitions,
  userLocation,
  fromDate,
  toDate,
  onViewModeChange
}) => {
  const [viewMode, setViewMode] = useLocalStorage<'calendar' | 'list'>('competitionViewMode', 'calendar');
  const [calendarScrollPosition, setCalendarScrollPosition] = useLocalStorage<number>('calendarScrollPosition', 0);
  const [listScrollPosition, setListScrollPosition] = useLocalStorage<number>('listScrollPosition', 0);
  
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  
  const calendarScrollRef = useRef<HTMLDivElement>(null);
  const listScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onViewModeChange) {
      onViewModeChange(viewMode);
    }
  }, [onViewModeChange, viewMode]);

  const saveScrollPosition = () => {
    if (viewMode === 'calendar' && calendarScrollRef.current) {
      setCalendarScrollPosition(calendarScrollRef.current.scrollTop);
    } else if (viewMode === 'list' && listScrollRef.current) {
      setListScrollPosition(listScrollRef.current.scrollTop);
    }
  };

  const handleTabChange = (value: string) => {
    saveScrollPosition();
    const newViewMode = value as 'calendar' | 'list';
    
    if (newViewMode === 'list') {
      const currentTime = new Date().getTime();
      const timeSinceLastTap = currentTime - lastTapTime;
      
      // Reset the tap count if it's been too long since the last tap
      if (timeSinceLastTap > 1500) {
        setTapCount(1); // Start at 1 for the current tap
      } else {
        // Increment tap count
        const newTapCount = tapCount + 1;
        setTapCount(newTapCount);
        
        // Check if we've reached 5 taps
        if (newTapCount >= 5) {
          // Reset local storage and reload
          localStorage.removeItem('userLocation');
          localStorage.removeItem('searchRadius');
          console.log('Resetting location and radius via secret tap gesture');
          window.location.reload();
        }
      }
      
      setLastTapTime(currentTime);
    }
    
    setViewMode(newViewMode);
    
    if (onViewModeChange) {
      onViewModeChange(newViewMode);
    }
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
            <CompetitionList
              competitions={competitions}
              userLocation={userLocation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionLayout;
