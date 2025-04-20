
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarDays, List } from 'lucide-react';

export type ViewMode = 'list' | 'calendar';

interface ViewToggleProps {
  currentView: ViewMode;
  onChange: (view: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onChange }) => {
  return (
    <div className="flex justify-end mb-2">
      <div className="bg-muted/30 p-1 rounded-md flex">
        <Button
          variant={currentView === 'list' ? 'secondary' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange('list')}
        >
          <List className="h-4 w-4" />
          <span className="sr-only">Visa som lista</span>
        </Button>
        <Button
          variant={currentView === 'calendar' ? 'secondary' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange('calendar')}
        >
          <CalendarDays className="h-4 w-4" />
          <span className="sr-only">Visa som kalender</span>
        </Button>
      </div>
    </div>
  );
};

export default ViewToggle;
