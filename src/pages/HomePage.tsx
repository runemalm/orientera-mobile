
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight } from 'lucide-react';
import MobileLayout from '../components/layout/MobileLayout';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleFindCompetitions = () => {
    navigate('/competitions');
  };

  return (
    <MobileLayout title="Hem">
      <div className="flex flex-col min-h-[80vh] justify-center p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">
            Hitta tävlingar
          </h1>
          <p className="text-xl text-gray-600">
            Upptäck orienteringstävlingar nära dig
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="space-y-6">
          <ul className="space-y-3">
            {[
              'Se kommande tävlingar i ditt område',
              'Direkt information om alla event',
              'Enkel översikt av tävlingsdetaljer'
            ].map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>

          <Button 
            onClick={handleFindCompetitions} 
            className="w-full py-6 text-lg shadow-lg hover:scale-105 transition-transform duration-200 group"
          >
            Hitta tävlingar nära dig
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
