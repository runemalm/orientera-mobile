
import React from 'react';
import { CompetitionSummary } from '../../types';
import CalendarWeek from './CalendarWeek';

interface CalendarFlowProps {
  weeks: {
    weekNumber: number;
    days: {
      date: Date;
      isWeekend: boolean;
      competitions: CompetitionSummary[];
    }[];
  }[];
}

const CalendarFlow: React.FC<CalendarFlowProps> = ({ weeks }) => {
  return (
    <div className="space-y-2">
      {weeks.map((week) => (
        <CalendarWeek
          key={`week-${week.weekNumber}`}
          days={week.days}
          weekNumber={week.weekNumber}
        />
      ))}
    </div>
  );
};

export default CalendarFlow;
