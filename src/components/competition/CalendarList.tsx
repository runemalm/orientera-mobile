import React, { useMemo } from 'react';
import { CompetitionSummary } from '../../types';
import { 
  startOfWeek,
  endOfWeek, 
  eachDayOfInterval, 
  isWeekend,
  getWeek,
  isMonday,
  compareAsc,
  isSameDay,
} from 'date-fns';
import { sv } from 'date-fns/locale';
import { SWEDISH_TIMEZONE } from '../../utils/dateUtils';
import { toZonedTime } from 'date-fns-tz';
import CalendarFlow from './CalendarFlow';

interface CalendarListProps {
  competitions: CompetitionSummary[];
  fromDate: Date;
  toDate: Date;
}

const CalendarList: React.FC<CalendarListProps> = ({
  competitions,
  fromDate,
  toDate
}) => {
  const sortedCompetitions = useMemo(() => {
    return [...competitions].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return compareAsc(dateA, dateB);
    });
  }, [competitions]);

  const days = useMemo(() => {
    const adjustedFromDate = isMonday(fromDate) 
      ? fromDate 
      : startOfWeek(fromDate, { weekStartsOn: 1 });
    
    const adjustedToDate = endOfWeek(toDate, { weekStartsOn: 1 });
    
    return eachDayOfInterval({
      start: adjustedFromDate,
      end: adjustedToDate
    });
  }, [fromDate, toDate]);

  const calendarStructure = useMemo(() => {
    const weeks: {
      weekNumber: number;
      days: {
        date: Date;
        isWeekend: boolean;
        competitions: CompetitionSummary[];
      }[];
    }[] = [];

    let currentWeek: typeof weeks[0] | null = null;

    days.forEach(day => {
      const zonedDay = toZonedTime(day, SWEDISH_TIMEZONE);
      const weekNumber = getWeek(zonedDay, { weekStartsOn: 1, firstWeekContainsDate: 4 });
      const isWeekendDay = isWeekend(zonedDay);
      
      const dayCompetitions = sortedCompetitions.filter(comp => 
        isSameDay(new Date(comp.date), zonedDay)
      );

      if (!currentWeek || currentWeek.weekNumber !== weekNumber) {
        currentWeek = {
          weekNumber,
          days: []
        };
        weeks.push(currentWeek);
      }

      currentWeek.days.push({
        date: zonedDay,
        isWeekend: isWeekendDay,
        competitions: dayCompetitions
      });
    });

    return weeks;
  }, [days, sortedCompetitions]);

  if (calendarStructure.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Inga dagar att visa</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <CalendarFlow weeks={calendarStructure} />
    </div>
  );
};

export default CalendarList;
