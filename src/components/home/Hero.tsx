
import React from 'react';
import { Compass } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-center w-full py-8">
      <div className={`flex ${isMobile ? 'flex-row gap-6' : 'flex-col gap-8'} items-center max-w-sm`}>
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center shrink-0">
            <Compass className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl -z-10" />
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Upptäck orienterings­tävlingar
          </h1>
          <p className="text-muted-foreground text-lg">
            Ett enkelt sätt att hitta ditt nästa äventyr i skogen
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
