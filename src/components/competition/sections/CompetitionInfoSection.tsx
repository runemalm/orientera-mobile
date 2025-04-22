
import React from 'react';
import { Competition, Resource, ResourceType } from '@/types';
import { CircleAlert, FileText } from 'lucide-react';
import CompetitionSection from '../details/CompetitionSection';
import CompetitionSectionItem from '../details/CompetitionSectionItem';

interface CompetitionInfoSectionProps {
  competition: Competition;
}

const CompetitionInfoSection: React.FC<CompetitionInfoSectionProps> = ({ competition }) => {
  const invitation = competition.resources?.find(r => r.type === ResourceType.Invitation);
  const pm = competition.resources?.find(r => r.type === ResourceType.PM);

  if (!invitation && !pm) return null;

  return (
    <CompetitionSection icon={CircleAlert} title="Tävlingsinformation">
      {invitation && (
        <CompetitionSectionItem
          icon={FileText}
          title={invitation.name}
          href={invitation.url}
        />
      )}
      {pm && (
        <CompetitionSectionItem
          icon={FileText}
          title={pm.name}
          href={pm.url}
        />
      )}
    </CompetitionSection>
  );
};

export default CompetitionInfoSection;
