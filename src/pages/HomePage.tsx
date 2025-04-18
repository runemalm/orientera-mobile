
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import CallToAction from '../components/home/CallToAction';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleFindCompetitions = () => {
    navigate('/competitions');
  };

  return (
    <MobileLayout title="Hem">
      <div className="flex flex-col items-center min-h-full space-y-12">
        <Hero />
        <Features />
        <div className="mt-auto pb-8">
          <CallToAction onAction={handleFindCompetitions} />
        </div>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
