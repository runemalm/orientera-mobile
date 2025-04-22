
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
  const entryList = competition.resources?.find(r => r.type === ResourceType.EntryList);

  if (!invitation && !pm && !entryList) return null;

  return (
    <CompetitionSection icon={CircleAlert} title="Tävlingsinformation">
      {invitation && (
        <CompetitionSectionItem
          icon={FileText}
          title={invitation.name}
          href={invitation.url}
        />
      )}
      {entryList && (
        <CompetitionSectionItem
          icon={FileText}
          title={entryList.name}
          href={entryList.url}
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
