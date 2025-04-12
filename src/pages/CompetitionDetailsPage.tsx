
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionDetails from '../components/CompetitionDetails';
import { mockCompetitionDetails } from '../utils/mockData';
import { Competition } from '../types'; // Updated type import
import { Toaster } from '@/components/ui/toaster';
import { Trophy } from 'lucide-react';

const CompetitionDetailsPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const [competition, setCompetition] = useState<Competition | null>(null); // Updated type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with timeout
    const timer = setTimeout(() => {
      if (competitionId && mockCompetitionDetails[competitionId]) {
        const competitionData = mockCompetitionDetails[competitionId];
        
        // Add sample Livelox link to some competitions
        if (competitionId === 'comp-1' || competitionId === 'comp-3') {
          competitionData.liveloxLink = `https://www.livelox.com/Events/${competitionId === 'comp-1' ? '12345' : '67890'}`;
        }
        
        setCompetition(competitionData);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [competitionId]);

  if (loading) {
    return (
      <MobileLayout title="Laddar..." showBackButton>
        <div className="flex flex-col justify-center items-center h-64 mt-4 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-500">Hämtar tävlingsinformation...</p>
        </div>
        <Toaster />
      </MobileLayout>
    );
  }

  if (!competition) {
    return (
      <MobileLayout title="Hittades inte" showBackButton>
        <div className="flex flex-col items-center justify-center h-64 mt-8 px-4 text-center">
          <div className="bg-red-100 rounded-full p-4 mb-4">
            <Trophy size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold">Tävlingen hittades inte</h2>
          <p className="text-gray-500 mt-2">Vi kunde tyvärr inte hitta den tävling du söker.</p>
        </div>
        <Toaster />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title={competition.name} showBackButton>
      <div className="pb-4">
        <CompetitionDetails competition={competition} />
      </div>
      <Toaster />
    </MobileLayout>
  );
};

export default CompetitionDetailsPage;
