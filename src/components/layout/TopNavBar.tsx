
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopNavBarProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  action?: React.ReactNode;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ title, showBackButton = false, onBack, action }) => {
  return (
    <div className="top-nav flex items-center justify-between px-4">
      {/* Left slot - Back button or empty */}
      <div className="w-20">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="text-muted-foreground -ml-2"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Center slot - Title */}
      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold truncate">{title}</h1>
      </div>

      {/* Right slot - Action button or empty */}
      <div className="w-20 flex justify-end">
        {action}
      </div>
    </div>
  );
};

export default TopNavBar;
