import React from 'react';
import { useParams } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionLocationMap from '../components/CompetitionLocationMap';
import { useQuery } from '@tanstack/react-query';
import { getCompetitionById } from '../services/api';
import { AlertTriangle } from 'lucide-react';

const CompetitionMapPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();

  const { data: competition, isLoading, error } = useQuery({
    queryKey: ['competition', competitionId],
    queryFn: () => getCompetitionById(competitionId!),
  });

  if (isLoading) {
    return (
      <MobileLayout title="Laddar..." showBackButton>
        <div className="flex flex-col justify-center items-center h-64 mt-4 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-500">Hämtar tävlingsplatsen...</p>
        </div>
      </MobileLayout>
    );
  }

  if (error || !competition || !competition.latitude || !competition.longitude) {
    return (
      <MobileLayout title="Fel" showBackButton>
        <div className="flex flex-col items-center justify-center h-64 mt-8 px-4 text-center">
          <div className="bg-red-100 rounded-full p-4 mb-4">
            <AlertTriangle className="text-red-500 h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">Kartan kunde inte laddas</h2>
          <p className="text-gray-500 mt-2">
            Tävlingsplatsen saknar koordinater eller kunde inte hämtas.
          </p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout 
      title="Tävlingsplats" 
      showBackButton
    >
      <div className="h-[calc(100vh-64px)] -mx-4 relative">
        <CompetitionLocationMap 
          locationName={competition.location}
          coordinates={{ lat: competition.latitude, lng: competition.longitude }}
          className="h-full w-full"
        />
      </div>
    </MobileLayout>
  );
};

export default CompetitionMapPage;
