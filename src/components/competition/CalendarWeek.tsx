
import React, { useMemo } from 'react';
import { CompetitionSummary } from '../../types';
import { format, isSameDay, isPast, isToday } from 'date-fns';
import { sv } from 'date-fns/locale';
import CalendarDay from './CalendarDay';

interface CalendarWeekProps {
  weekNumber: number;
  days: {
    date: Date;
    isWeekend: boolean;
    competitions: CompetitionSummary[];
  }[];
}

const CalendarWeek: React.FC<CalendarWeekProps> = ({
  weekNumber,
  days,
}) => {
  const todayDate = useMemo(() => new Date(), []);
  
  return (
    <div className="mb-3 rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div>
        {days.map((day, index) => {
          const isCurrentDay = isToday(day.date);
          const dayIsPast = isPast(day.date) && !isCurrentDay;
          
          return (
            <CalendarDay
              key={`day-${day.date.toISOString()}-${index}`}
              date={day.date}
              competitions={day.competitions}
              isWeekend={day.isWeekend}
              isToday={isCurrentDay}
              isPast={dayIsPast}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWeek;
