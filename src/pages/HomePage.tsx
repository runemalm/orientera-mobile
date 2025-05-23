
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import Hero from '../components/home/Hero';
import CallToAction from '../components/home/CallToAction';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleFindCompetitions = () => {
    navigate('/competitions');
  };

  return (
    <MobileLayout title="Orientera.com">
      <div className="flex flex-col items-center gap-8 py-4">
        <Hero />
        <CallToAction onAction={handleFindCompetitions} />
      </div>
    </MobileLayout>
  );
};

export default HomePage;
