
import React from 'react';

interface CalendarWeekHeaderProps {
  weekNumber: number;
}

const CalendarWeekHeader: React.FC<CalendarWeekHeaderProps> = ({ weekNumber }) => {
  return (
    <div className="px-4 py-2 bg-gray-100/80 border-b border-cool-gray/30 rounded-t-lg">
      <span className="text-sm font-medium text-gray-600">
        Vecka {weekNumber}
      </span>
    </div>
  );
};

export default CalendarWeekHeader;

