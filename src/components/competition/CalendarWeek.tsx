import React from 'react';
import { CompetitionSummary } from '../../types';
import CalendarDay from './CalendarDay';
import { Separator } from '../ui/separator';
import { isSameDay } from 'date-fns';

interface CalendarWeekProps {
  days: {
    date: Date;
    isWeekend: boolean;
    competitions: CompetitionSummary[];
  }[];
  weekNumber: number;
}

const CalendarWeek: React.FC<CalendarWeekProps> = ({ days, weekNumber }) => {
  const today = new Date();

  return (
    <div className="space-y-[1px]">
      {days.map((day, dayIndex) => (
        <React.Fragment key={day.date.toISOString()}>
          <CalendarDay
            date={day.date}
            competitions={day.competitions}
            isWeekend={day.isWeekend}
            isToday={isSameDay(day.date, today)}
            isPast={day.date < today}
          />
          {dayIndex === days.length - 1 && (
            <Separator className="my-1 bg-gray-100 rounded-full" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CalendarWeek;
