import React, { useMemo } from 'react';
import { CompetitionSummary } from '../../types';
import { UserLocation } from '../../hooks/useUserLocation';
import { 
  startOfWeek,
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  isWeekend,
  format,
  getWeek,
  getMonth,
  isSameMonth,
  isSameWeek,
  addDays,
  isMonday,
  startOfDay,
  compareAsc,
  differenceInCalendarDays
} from 'date-fns';
import { sv } from 'date-fns/locale';
import { SWEDISH_TIMEZONE, formatSwedishDate } from '../../utils/dateUtils';
import { toZonedTime } from 'date-fns-tz';
import CompetitionCard from '../../components/CompetitionCard';
import { Card } from '@/components/ui/card';
import CalendarCompetitionItem from './CalendarCompetitionItem';

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
  // Sort competitions by date
  const sortedCompetitions = useMemo(() => {
    return [...competitions].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return compareAsc(dateA, dateB);
    });
  }, [competitions]);

  // Generate all days between fromDate and toDate
  const days = useMemo(() => {
    // Make sure we start on a Monday by finding the Monday of the week containing fromDate
    const adjustedFromDate = isMonday(fromDate) 
      ? fromDate 
      : startOfWeek(fromDate, { weekStartsOn: 1 });
    
    // Make sure we end on a Sunday
    const adjustedToDate = endOfWeek(toDate, { weekStartsOn: 1 });
    
    return eachDayOfInterval({
      start: adjustedFromDate,
      end: adjustedToDate
    });
  }, [fromDate, toDate]);

  // Group days by month and week
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
      
      // Filter competitions for this day
      const dayCompetitions = sortedCompetitions.filter(comp => 
        isSameDay(new Date(comp.date), zonedDay)
      );

      // Check if we need to create a new month
      if (!currentMonth || !isSameMonth(zonedDay, toZonedTime(days[days.indexOf(day) - 1] || day, SWEDISH_TIMEZONE))) {
        currentMonth = {
          month,
          monthName: format(zonedDay, 'MMMM yyyy', { locale: sv }),
          weeks: []
        };
        structure.push(currentMonth);
        currentWeek = null;
      }

      // Check if we need to create a new week
      if (!currentWeek || !isSameWeek(zonedDay, toZonedTime(days[days.indexOf(day) - 1] || day, SWEDISH_TIMEZONE), { weekStartsOn: 1 })) {
        currentWeek = {
          weekNumber,
          days: []
        };
        currentMonth.weeks.push(currentWeek);
      }

      // Add the day to the current week
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
        <div key={`month-${monthIndex}`} className="space-y-2">
          {/* Month header */}
          <h2 className="text-lg font-semibold capitalize px-1 text-gray-700">
            {month.monthName}
          </h2>

          {month.weeks.map((week, weekIndex) => (
            <div 
              key={`week-${monthIndex}-${weekIndex}`} 
              className="space-y-[1px] bg-soft-gray/50 rounded-lg border border-gray-100"
            >
              {/* Week header */}
              <div className="flex items-center gap-2 px-2 py-1.5 bg-soft-purple/20 rounded-t-lg">
                <span className="text-sm font-medium text-gray-600">Vecka {week.weekNumber}</span>
              </div>

              {/* Days */}
              <div className="space-y-[1px] rounded-b-lg overflow-hidden">
                {week.days.map((day) => {
                  const hasCompetitions = day.competitions.length > 0;
                  const today = new Date();
                  const isToday = isSameDay(day.date, toZonedTime(today, SWEDISH_TIMEZONE));
                  const isPast = day.date < today;
                  
                  return (
                    <div 
                      key={day.date.toISOString()} 
                      className={`
                        border-l-2 
                        transition-colors duration-200
                        ${isToday ? 'border-l-primary bg-primary/5' : 'border-l-transparent'}
                        ${day.isWeekend ? 
                          (hasCompetitions ? 'bg-soft-purple/5' : 'bg-soft-gray/80') 
                          : hasCompetitions ? 'bg-soft-green/10' : 'bg-white/40'}
                        ${!hasCompetitions ? 'opacity-50' : ''}
                        hover:bg-soft-purple/10
                        border-b border-gray-100/50 last:border-b-0
                      `}
                    >
                      <div className="flex min-h-[2.5rem] items-start w-full">
                        <div className={`
                          w-[4.5rem] py-2 px-2 text-sm shrink-0
                          ${isPast ? 'text-gray-400' : ''}
                          ${isToday ? 'text-primary font-medium' : 'text-gray-600'}
                          ${day.isWeekend && !hasCompetitions ? 'italic text-gray-500' : ''}
                        `}>
                          {format(day.date, 'EEE d', { locale: sv })}
                        </div>
                        
                        <div className="flex-1 py-1 pr-2 min-w-0 overflow-hidden">
                          {hasCompetitions && (
                            <div className="space-y-1">
                              {day.competitions.map(competition => (
                                <CalendarCompetitionItem
                                  key={competition.id}
                                  competition={competition}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CalendarList;
