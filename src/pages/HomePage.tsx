
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, ArrowRight } from 'lucide-react';
import MobileLayout from '../components/layout/MobileLayout';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleFindCompetitions = () => {
    navigate('/competitions');
  };

  return (
    <MobileLayout title="Hem">
      <div className="flex flex-col items-center justify-between min-h-[80vh] p-6">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center w-full space-y-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-4">
            <Compass className="w-10 h-10 text-primary" />
          </div>

          <div className="text-center space-y-3 max-w-sm">
            <h1 className="text-3xl font-bold tracking-tight">
              Upptäck orienterings­tävlingar i närheten
            </h1>
            <p className="text-muted-foreground">
              Ett enkelt sätt att hitta ditt nästa äventyr i skogen
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full mt-8">
          <Button 
            onClick={handleFindCompetitions} 
            className="w-full py-7 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
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
