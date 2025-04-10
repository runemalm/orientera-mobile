
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionDetails from '../components/CompetitionDetails';
import { mockCompetitionDetails } from '../utils/mockData';
import { CompetitionDetail } from '../types';
import { Toaster } from '@/components/ui/toaster';

const CompetitionDetailsPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const [competition, setCompetition] = useState<CompetitionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with timeout
    const timer = setTimeout(() => {
      if (competitionId && mockCompetitionDetails[competitionId]) {
        setCompetition(mockCompetitionDetails[competitionId]);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [competitionId]);

  const handleSignUpComplete = () => {
    // We still update the state in the background but don't display it to the user
    if (competition) {
      setCompetition({
        ...competition,
        isRegistered: true
      });
    }
  };

  if (loading) {
    return (
      <MobileLayout title="Laddar..." showBackButton>
        <div className="flex justify-center items-center h-64 mt-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Toaster />
      </MobileLayout>
    );
  }

  if (!competition) {
    return (
      <MobileLayout title="Hittades inte" showBackButton>
        <div className="flex flex-col items-center justify-center h-64 mt-4">
          <div className="text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Tävlingen hittades inte</h2>
          <p className="text-gray-500 mt-2">Tävlingen du söker existerar inte</p>
        </div>
        <Toaster />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title={competition.name} showBackButton>
      <div className="pb-4">
        <CompetitionDetails 
          competition={competition} 
          onSignUpComplete={handleSignUpComplete} 
        />
      </div>
      <Toaster />
    </MobileLayout>
  );
};

export default CompetitionDetailsPage;
