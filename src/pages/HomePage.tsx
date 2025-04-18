
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navigation, Flag, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import MobileLayout from '../components/layout/MobileLayout';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleFindCompetitions = () => {
    navigate('/competitions');
  };

  return (
    <MobileLayout title="Hem">
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">orientera.com</h1>
          <p className="text-gray-600 mb-6">
            Ett enklare sätt att hitta och följa orienteringstävlingar när du är på språng.
          </p>
        </div>

        <Button 
          onClick={handleFindCompetitions} 
          className="w-full py-6 text-lg shadow-lg hover:scale-105 transition-transform group"
        >
          Hitta tävlingar <Navigation className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Flag className="text-primary w-5 h-5" />
            <div>
              <h3 className="font-medium">Tävlingsinformation</h3>
              <p className="text-sm text-muted-foreground">
                Hitta och kolla upp tävlingar i hela Sverige
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Settings className="text-primary w-5 h-5" />
            <div>
              <h3 className="font-medium">Kommande funktioner</h3>
              <p className="text-sm text-muted-foreground">
                Anmälan, resultat och statistik kommer snart
              </p>
            </div>
          </div>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Version 1.0.0 - Beta
        </p>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
