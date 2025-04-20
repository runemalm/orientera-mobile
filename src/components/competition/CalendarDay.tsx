
import React from 'react';
import { CompetitionSummary } from '../../types';
import CalendarCompetitionItem from './CalendarCompetitionItem';
import { cn } from '@/lib/utils';

interface CalendarDayProps {
  date: Date;
  competitions: CompetitionSummary[];
  isWeekend: boolean;
  isToday: boolean;
  isPast: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  competitions,
  isWeekend,
  isToday,
  isPast,
}) => {
  const hasCompetitions = competitions.length > 0;

  // Format date with month, e.g., "mån 21/4"
  const formattedDate = date.toLocaleDateString('sv-SE', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'numeric' 
  }).replace(',', '/');

  return (
    <div 
      className={cn(
        "border-l-2 transition-colors duration-200",
        'border-l-transparent',
        isWeekend ? 'bg-red-100/60' : 'bg-white/40',
        ''
      )}
    >
      <div className="flex min-h-[2.5rem] w-full">
        <div className={cn(
          "w-[5rem] pt-3 px-2 text-sm shrink-0 self-start whitespace-nowrap overflow-hidden text-ellipsis",
          isPast ? 'text-gray-400' : 'text-gray-600',
          isWeekend ? 'font-medium' : ''
        )}>
          {formattedDate}
        </div>
        
        <div className="flex-1 py-1 pr-2 min-w-0 overflow-hidden">
          {hasCompetitions && (
            <div className="space-y-1">
              {competitions.map((competition, index) => (
                <CalendarCompetitionItem
                  key={competition.id}
                  competition={competition}
                  className={index === 0 ? 'first:self-center' : ''}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarDay;
