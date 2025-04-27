
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
  
  const calendarScrollRef = useRef<HTMLDivElement>(null);
  const listScrollRef = useRef<HTMLDivElement>(null);

  // Notify parent of initial view mode on mount
  useEffect(() => {
    if (onViewModeChange) {
      onViewModeChange(viewMode);
    }
  }, [onViewModeChange, viewMode]);

  // Save scroll position when tab changes or component unmounts
  const saveScrollPosition = () => {
    if (viewMode === 'calendar' && calendarScrollRef.current) {
      setCalendarScrollPosition(calendarScrollRef.current.scrollTop);
    } else if (viewMode === 'list' && listScrollRef.current) {
      setListScrollPosition(listScrollRef.current.scrollTop);
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    saveScrollPosition();
    const newViewMode = value as 'calendar' | 'list';
    setViewMode(newViewMode);
    
    // Notify parent component about view mode change
    if (onViewModeChange) {
      onViewModeChange(newViewMode);
    }
  };

  // Restore scroll position on mount and tab change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (viewMode === 'calendar' && calendarScrollRef.current) {
        calendarScrollRef.current.scrollTop = calendarScrollPosition;
      } else if (viewMode === 'list' && listScrollRef.current) {
        listScrollRef.current.scrollTop = listScrollPosition;
      }
    }, 50); // Small delay to ensure the DOM has updated

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
