
import React from 'react';
import { CalendarRange, Calendar as CalendarIcon } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FilterSection from './FilterSection';
import { formatSwedishDate } from '@/utils/dateUtils';

interface DateRangeFilterProps {
  from: Date | null;
  to: Date | null;
  onSelectDate: (type: 'from' | 'to') => void;
}

const DateRangeFilter = ({ from, to, onSelectDate }: DateRangeFilterProps) => {
  const getFormattedDate = (date: Date | null) => {
    if (!date) return 'Välj datum';
    return formatSwedishDate(date, 'PPP');
  };

  return (
    <FilterSection icon={CalendarRange} title="Datumintervall">
      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">Från</Label>
          <Button
            variant="outline"
            onClick={() => onSelectDate('from')}
            className="w-full justify-start text-left"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getFormattedDate(from)}
          </Button>
        </div>
        <div>
          <Label className="mb-2 block">Till</Label>
          <Button
            variant="outline"
            onClick={() => onSelectDate('to')}
            className="w-full justify-start text-left"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getFormattedDate(to)}
          </Button>
        </div>
      </div>
    </FilterSection>
  );
};

export default DateRangeFilter;
