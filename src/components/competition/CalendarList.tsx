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
import { Calendar, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
      const dayIsWeekend = isWeekend(zonedDay);
      
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
        isWeekend: dayIsWeekend,
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
    <div className="space-y-8 max-w-full overflow-hidden">
      {calendarStructure.map((month, monthIndex) => (
        <div key={`month-${monthIndex}`} className="space-y-4">
          <div className="bg-white sticky top-16 z-10 pt-2 pb-2">
            <div className="flex items-center gap-2 px-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold capitalize text-primary">
                {month.monthName}
              </h2>
            </div>
            <Separator className="mt-2 bg-gray-100" />
          </div>

          <div className="space-y-1 rounded-lg">
            {month.weeks.flatMap((week, weekIndex) => 
              week.days.map((day, dayIndex, daysArray) => {
                const hasCompetitions = day.competitions.length > 0;
                const today = new Date();
                const isToday = isSameDay(day.date, toZonedTime(today, SWEDISH_TIMEZONE));
                const isPast = day.date < today;
                const dayIsWeekend = day.isWeekend;
                const isMonday = day.date.getDay() === 1;
                const isSunday = day.date.getDay() === 0;
                
                return (
                  <React.Fragment key={day.date.toISOString()}>
                    <div 
                      className={`
                        rounded-lg overflow-hidden
                        transition-all duration-200 hover:shadow-sm
                        ${isToday ? 'ring-1 ring-primary shadow-sm' : ''}
                        ${dayIsWeekend ? 
                          (hasCompetitions ? 'bg-red-50' : 'bg-red-50/60') 
                          : hasCompetitions ? 'bg-primary/5' : 'bg-white'}
                        ${hasCompetitions ? '' : 'opacity-80 hover:opacity-100'}
                      `}
                    >
                      <div className="flex min-h-[2.5rem] w-full">
                        <div className={`
                          w-[4rem] py-2 px-3 shrink-0 self-start flex flex-col items-center justify-center
                          ${isToday ? 'bg-primary text-white font-medium rounded-l-lg' : dayIsWeekend ? 'bg-red-100/40' : 'bg-gray-50'}
                        `}>
                          <span className={`text-xs uppercase ${isToday ? 'text-white/80' : 'text-gray-500'}`}>
                            {format(day.date, 'EEE', { locale: sv })}
                          </span>
                          <span className={`text-lg ${isToday ? 'text-white' : isPast ? 'text-gray-400' : dayIsWeekend ? 'text-red-600' : 'text-gray-700'}`}>
                            {format(day.date, 'd', { locale: sv })}
                          </span>
                        </div>
                        
                        <div className="flex-1 py-2 px-3 min-w-0">
                          {hasCompetitions ? (
                            <div className="space-y-1.5">
                              {day.competitions.map((competition, index) => (
                                <CalendarCompetitionItem
                                  key={competition.id}
                                  competition={competition}
                                  className={`${index === 0 ? 'first:self-center' : ''} ${isToday ? 'border-primary/20' : ''}`}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <p className="text-sm text-gray-400">Inga tävlingar</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Separator className="my-1.5 h-px bg-gray-100" />
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarList;
