
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopNavBarProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  action?: React.ReactNode;
  leftAction?: React.ReactNode; // Added leftAction prop
}

const TopNavBar: React.FC<TopNavBarProps> = ({ 
  title, 
  showBackButton = false, 
  onBack, 
  action,
  leftAction // Added leftAction prop
}) => {
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  const handleTitleTap = () => {
    const currentTime = new Date().getTime();
    const timeSinceLastTap = currentTime - lastTapTime;
    
    // Reset counter if more than 1.5 seconds between taps
    if (timeSinceLastTap > 1500) {
      setTapCount(1);
    } else {
      setTapCount(prev => {
        if (prev + 1 === 5) {
          window.location.reload();
          return 0;
        }
        return prev + 1;
      });
    }
    
    setLastTapTime(currentTime);
  };

  return (
    <div className="top-nav flex items-center justify-between px-4">
      {/* Left slot - Back button, leftAction, or empty */}
      <div className="w-20">
        {showBackButton ? (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="text-muted-foreground -ml-2"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        ) : leftAction ? (
          leftAction
        ) : null}
      </div>

      {/* Center slot - Title */}
      <div 
        className="flex-1 text-center cursor-default select-none" 
        onClick={handleTitleTap}
      >
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
