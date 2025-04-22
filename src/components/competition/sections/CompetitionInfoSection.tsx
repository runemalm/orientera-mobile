import React from 'react';
import { Competition, Resource, ResourceType, ResourceFormat } from '@/types';
import { CircleAlert, FileText, Image } from 'lucide-react';
import CompetitionSection from '../details/CompetitionSection';
import CompetitionSectionItem from '../details/CompetitionSectionItem';

interface CompetitionInfoSectionProps {
  competition: Competition;
}

const getResourceIcon = (resource: Resource) => {
  if ([ResourceFormat.Png, ResourceFormat.Jpeg, ResourceFormat.Gif].includes(resource.format)) {
    return Image;
  }
  return FileText;
};

const CompetitionInfoSection: React.FC<CompetitionInfoSectionProps> = ({ competition }) => {
  const invitation = competition.resources?.find(r => r.type === ResourceType.Invitation);
  const pm = competition.resources?.find(r => r.type === ResourceType.PM);

  if (!invitation && !pm) return null;

  return (
    <CompetitionSection icon={CircleAlert} title="Tävlingsinformation">
      {invitation && (
        <CompetitionSectionItem
          icon={getResourceIcon(invitation)}
          title={invitation.name}
          href={invitation.url}
          count={invitation.count}
        />
      )}
      {pm && (
        <CompetitionSectionItem
          icon={getResourceIcon(pm)}
          title={pm.name}
          href={pm.url}
          count={pm.count}
        />
      )}
    </CompetitionSection>
  );
};

export default CompetitionInfoSection;
