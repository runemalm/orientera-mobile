
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, ArrowRight } from 'lucide-react';
import MobileLayout from '../components/layout/MobileLayout';
import { useIsMobile } from '../hooks/use-mobile';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleFindCompetitions = () => {
    navigate('/competitions');
  };

  return (
    <MobileLayout title="Hem">
      <div className="flex flex-col items-center justify-between h-full p-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="flex items-center justify-center w-full">
          <div className={`flex ${isMobile ? 'flex-row gap-4' : 'flex-col gap-6'} items-center max-w-sm`}>
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center shrink-0">
              <Compass className="w-10 h-10 text-primary" />
            </div>

            <div className="text-center space-y-3">
              <h1 className="text-2xl font-bold tracking-tight">
                Upptäck orienterings­tävlingar i närheten
              </h1>
              <p className="text-muted-foreground text-sm">
                Ett enkelt sätt att hitta ditt nästa äventyr i skogen
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full">
          <Button 
            onClick={handleFindCompetitions} 
            className="w-full py-6 text-lg font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            Visa tävlingar
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
