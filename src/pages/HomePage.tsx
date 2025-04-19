
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
    <MobileLayout title="Orientera">
      <div className="flex flex-col items-center gap-8 py-4">
        <Hero />
        <Features />
        <CallToAction onAction={handleFindCompetitions} />
      </div>
    </MobileLayout>
  );
};

export default HomePage;
