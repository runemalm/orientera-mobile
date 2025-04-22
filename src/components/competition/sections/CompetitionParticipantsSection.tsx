
import React from 'react';
import { Competition } from '@/types';
import { Users, Car, Map, Navigation } from 'lucide-react';
import CompetitionSection from '../details/CompetitionSection';
import CompetitionSectionItem from '../details/CompetitionSectionItem';
import { hasValidCoordinates } from '@/utils/locationUtils';
import { useQuery } from '@tanstack/react-query';

interface CompetitionParticipantsSectionProps {
  competition: Competition;
}

const CompetitionParticipantsSection: React.FC<CompetitionParticipantsSectionProps> = ({ competition }) => {
  const { data: availableSeats = 0 } = useQuery({
    queryKey: ['carpooling-seats', competition.id],
    queryFn: async () => {
      return 0;
    }
  });

  const directionsUrl = hasValidCoordinates(competition.latitude, competition.longitude)
    ? `https://www.google.com/maps/dir/?api=1&destination=${competition.latitude},${competition.longitude}`
    : null;

  return (
    <CompetitionSection icon={Users} title="Deltagare och samåkning">
      <CompetitionSectionItem
        icon={Users}
        title="Anmälda deltagare"
        to={`/competition/${competition.id}/participants`}
        count={competition.participantCount || 0}
      />
      
      <CompetitionSectionItem
        icon={Users}
        title="Klubbanmälda"
        to={`/competition/${competition.id}/club-participants`}
        count={competition.clubParticipantCount || 0}
        iconClassName="text-blue-600"
      />
      
      <CompetitionSectionItem
        icon={Car}
        title="Samåkning"
        to={`/competition/${competition.id}/carpooling`}
        count={availableSeats}
      />

      {hasValidCoordinates(competition.latitude, competition.longitude) && (
        <CompetitionSectionItem
          icon={Map}
          title="Visa på karta"
          to={`/competition/${competition.id}/map`}
        />
      )}

      {directionsUrl && (
        <CompetitionSectionItem
          icon={Navigation}
          title="Vägbeskrivning i Google Maps"
          href={directionsUrl}
        />
      )}
    </CompetitionSection>
  );
};

export default CompetitionParticipantsSection;
