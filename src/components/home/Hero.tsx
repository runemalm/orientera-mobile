
import React, { useState } from 'react';
import { Compass } from 'lucide-react';

const Hero: React.FC = () => {
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  const handleTap = () => {
    const currentTime = new Date().getTime();
    const timeSinceLastTap = currentTime - lastTapTime;
    
    // If more than 1.5 seconds between taps, reset counter
    if (timeSinceLastTap > 1500) {
      setTapCount(1); // Start with 1 for this tap
    } else {
      // Only increment if it's a quick consecutive tap
      setTapCount(prev => prev + 1);
    }
    
    // Check for activation only on exact count of 5
    const newCount = timeSinceLastTap <= 1500 ? tapCount + 1 : 1;
    if (newCount === 5) {
      // Clear location settings from localStorage
      localStorage.removeItem('userLocation');
      localStorage.removeItem('competitionFilters');
      
      // Reload the page
      window.location.reload();
      
      // Reset counter after activation
      setTapCount(0);
    }
    
    // Always update the last tap time
    setLastTapTime(currentTime);
  };

  return (
    <div className="flex items-center justify-center w-full py-8" onClick={handleTap}>
      <div className="flex flex-col gap-8 items-center max-w-sm select-none">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center shrink-0">
            <Compass className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl -z-10" />
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Framtidens app för svensk orientering
          </h1>
          <p className="text-muted-foreground text-lg">
            Ett smidigare sätt att upptäcka och hålla koll på orienteringssäsongen
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
