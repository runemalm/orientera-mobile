
import React from 'react';
import CalendarWeek from './CalendarWeek';

interface CalendarMonthProps {
  monthName: string;
  weeks: {
    weekNumber: number;
    days: {
      date: Date;
      isWeekend: boolean;
      competitions: any[];
    }[];
  }[];
}

const CalendarMonth: React.FC<CalendarMonthProps> = ({ monthName, weeks }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold capitalize px-1 text-gray-700">
        {monthName}
      </h2>

      <div className="space-y-2 rounded-lg">
        <div className="rounded-lg overflow-hidden">
          {weeks.map((week) => (
            <CalendarWeek
              key={week.weekNumber}
              days={week.days}
              weekNumber={week.weekNumber}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarMonth;
