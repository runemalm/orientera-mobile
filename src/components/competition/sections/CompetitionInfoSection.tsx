
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
  const entryList = competition.resources?.find(r => r.type === ResourceType.EntryList);

  if (!invitation && !pm && !entryList) return null;

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
      {entryList && (
        <CompetitionSectionItem
          icon={getResourceIcon(entryList)}
          title={entryList.name}
          href={entryList.url}
          count={entryList.count}
        />
      )}
    </CompetitionSection>
  );
};

export default CompetitionInfoSection;
