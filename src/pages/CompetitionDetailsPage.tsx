
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionDetails from '../components/CompetitionDetails';
import { mockCompetitionDetails } from '../utils/mockData';
import { CompetitionDetail } from '../types';
import { useToast } from '@/components/ui/use-toast';

const CompetitionDetailsPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const [competition, setCompetition] = useState<CompetitionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
    // Update local data to reflect registration
    if (competition) {
      setCompetition({
        ...competition,
        isRegistered: true
      });
    }
  };

  if (loading) {
    return (
      <MobileLayout title="Loading..." showBackButton>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MobileLayout>
    );
  }

  if (!competition) {
    return (
      <MobileLayout title="Not Found" showBackButton>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Competition not found</h2>
          <p className="text-gray-500 mt-2">The competition you're looking for doesn't exist</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Competition Details" showBackButton>
      <CompetitionDetails 
        competition={competition} 
        onSignUpComplete={handleSignUpComplete}
      />
    </MobileLayout>
  );
};

export default CompetitionDetailsPage;
