
import React from 'react';
import { CompetitionSummary } from '../../types';
import { UserLocation } from '../../hooks/useUserLocation';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import CalendarList from './CalendarList';
import CompetitionList from './CompetitionList';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useScrollPosition } from '../../hooks/useScrollPosition';

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
  const calendarScrollRef = useScrollPosition('competition-calendar');
  const listScrollRef = useScrollPosition('competition-list');

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-3 pb-2 px-2">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'calendar' | 'list')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Kalender</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === 'calendar' ? (
          <div ref={calendarScrollRef} className="h-full overflow-auto px-2 pt-0 pb-4">
            <CalendarList
              competitions={competitions}
              userLocation={userLocation}
              fromDate={fromDate}
              toDate={toDate}
            />
          </div>
        ) : (
          <div ref={listScrollRef} className="h-full overflow-auto px-2 pt-0 pb-4">
            {userLocation && (
              <CompetitionList
                competitions={competitions}
                userLocation={userLocation}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionLayout;
