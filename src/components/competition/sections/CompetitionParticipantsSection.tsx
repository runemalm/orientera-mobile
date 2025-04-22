
import React from 'react';
import { Competition, ResourceType } from '@/types';
import { Users, Car, Map, Navigation, FileText, ListOrdered } from 'lucide-react';
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

  const startList = competition.resources?.find(r => r.type === ResourceType.StartList);

  const directionsUrl = hasValidCoordinates(competition.latitude, competition.longitude)
    ? `https://www.google.com/maps/dir/?api=1&destination=${competition.latitude},${competition.longitude}`
    : null;

  return (
    <CompetitionSection icon={Users} title="Deltagare och samåkning">
      <CompetitionSectionItem
        icon={ListOrdered}
        title="Alla anmälda"
        to={`/competition/${competition.id}/participants`}
        count={competition.participantCount}
      />

      {startList && (
        <CompetitionSectionItem
          icon={FileText}
          title="Startlista"
          href={startList.url}
          count={startList.count}
        />
      )}

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

