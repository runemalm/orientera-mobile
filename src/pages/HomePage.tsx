
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
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
          <h1 className="text-2xl font-bold mb-4">Orientera.com</h1>
          <p className="text-gray-600 mb-6">
            Ett komplement till Eventor. Hitta och utforska orienteringstävlingar enkelt med vår mobilapp.
          </p>
        </div>

        <Button 
          onClick={handleFindCompetitions} 
          className="w-full py-6 text-lg shadow-lg hover:scale-105 transition-transform group"
        >
          Hitta tävlingar <Navigation className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
