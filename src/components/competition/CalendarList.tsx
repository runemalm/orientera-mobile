import React, { useMemo } from 'react';
import { CompetitionSummary } from '../../types';
import { UserLocation } from '../../hooks/useUserLocation';
import { 
  startOfWeek,
  endOfWeek, 
  eachDayOfInterval, 
  isWeekend,
  getWeek,
  getMonth,
  isSameMonth,
  isSameWeek,
  isMonday,
  compareAsc,
} from 'date-fns';
import { sv } from 'date-fns/locale';
import { SWEDISH_TIMEZONE } from '../../utils/dateUtils';
import { toZonedTime } from 'date-fns-tz';
import CalendarMonth from './CalendarMonth';

interface CalendarListProps {
  competitions: CompetitionSummary[];
  userLocation: UserLocation | null;
  fromDate: Date;
  toDate: Date;
}

const CalendarList: React.FC<CalendarListProps> = ({
  competitions,
  userLocation,
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
    const structure: {
      month: number;
      monthName: string;
      weeks: {
        weekNumber: number;
        days: {
          date: Date;
          isWeekend: boolean;
          competitions: CompetitionSummary[];
        }[]
      }[]
    }[] = [];

    let currentMonth: typeof structure[0] | null = null;
    let currentWeek: typeof structure[0]['weeks'][0] | null = null;

    days.forEach(day => {
      const zonedDay = toZonedTime(day, SWEDISH_TIMEZONE);
      const month = getMonth(zonedDay);
      const weekNumber = getWeek(zonedDay, { weekStartsOn: 1, firstWeekContainsDate: 4 });
      const isWeekendDay = isWeekend(zonedDay);
      
      const dayCompetitions = sortedCompetitions.filter(comp => 
        isSameDay(new Date(comp.date), zonedDay)
      );

      if (!currentMonth || !isSameMonth(zonedDay, toZonedTime(days[days.indexOf(day) - 1] || day, SWEDISH_TIMEZONE))) {
        currentMonth = {
          month,
          monthName: format(zonedDay, 'MMMM yyyy', { locale: sv }),
          weeks: []
        };
        structure.push(currentMonth);
        currentWeek = null;
      }

      if (!currentWeek || !isSameWeek(zonedDay, toZonedTime(days[days.indexOf(day) - 1] || day, SWEDISH_TIMEZONE), { weekStartsOn: 1 })) {
        currentWeek = {
          weekNumber,
          days: []
        };
        currentMonth.weeks.push(currentWeek);
      }

      currentWeek.days.push({
        date: zonedDay,
        isWeekend: isWeekendDay,
        competitions: dayCompetitions
      });
    });

    return structure;
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
      {calendarStructure.map((month, monthIndex) => (
        <CalendarMonth
          key={`month-${monthIndex}`}
          monthName={month.monthName}
          weeks={month.weeks}
        />
      ))}
    </div>
  );
};

export default CalendarList;
