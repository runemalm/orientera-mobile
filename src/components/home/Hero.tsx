
import React, { useState, useEffect, useRef } from 'react';
import { Compass } from 'lucide-react';

const Hero: React.FC = () => {
  const [tapCount, setTapCount] = useState(0);
  const lastTapTime = useRef<number>(0);
  const TAP_TIMEOUT = 500; // 500ms window for taps

  const handleTap = () => {
    const now = Date.now();
    
    if (now - lastTapTime.current > TAP_TIMEOUT) {
      // Reset if too much time has passed
      setTapCount(1);
    } else {
      // Increment tap count
      const newCount = tapCount + 1;
      setTapCount(newCount);
      
      if (newCount >= 5) {
        console.log('Resetting location settings...');
        localStorage.removeItem('userLocation');
        localStorage.removeItem('searchRadius');
        window.location.reload();
      }
    }
    
    lastTapTime.current = now;
  };

  return (
    <div className="flex items-center justify-center w-full py-8">
      <div className="flex flex-col gap-8 items-center max-w-sm">
        <div 
          className="relative cursor-pointer" 
          onClick={handleTap}
        >
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
