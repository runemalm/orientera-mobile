
import React from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface CalendarWeekHeaderProps {
  weekNumber: number;
  startDate?: Date; // Make startDate optional
}

const CalendarWeekHeader: React.FC<CalendarWeekHeaderProps> = ({ weekNumber, startDate }) => {
  const monthName = startDate ? format(startDate, 'MMMM', { locale: sv }) : '';
  
  return (
    <div className="flex justify-between items-center py-2 px-3 text-sm text-gray-600">
      <span>Vecka {weekNumber}</span>
      {startDate && <span className="capitalize">{monthName}</span>}
    </div>
  );
};

export default CalendarWeekHeader;
