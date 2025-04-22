
import React from 'react';
import { Competition, Resource, ResourceType, ResourceFormat } from '@/types';
import { ExternalLink, FileText, Link2, Image } from 'lucide-react';
import CompetitionSection from '../details/CompetitionSection';
import CompetitionSectionItem from '../details/CompetitionSectionItem';

const getResourceIcon = (resource: Resource) => {
  if ([ResourceFormat.Png, ResourceFormat.Jpeg, ResourceFormat.Gif].includes(resource.format)) {
    return Image;
  }
  return FileText;
};

interface CompetitionLinksSectionProps {
  competition: Competition;
}

const CompetitionLinksSection: React.FC<CompetitionLinksSectionProps> = ({ competition }) => {
  const otherResources = competition.resources?.filter(r =>
    r.type === ResourceType.Other
  );

  if (!otherResources?.length && !competition.eventorLink) return null;

  return (
    <CompetitionSection icon={Link2} title="Övriga dokument och länkar">
      {otherResources?.map((resource) => (
        <CompetitionSectionItem
          key={resource.id}
          icon={resource.format === ResourceFormat.Link ? ExternalLink : getResourceIcon(resource)}
          title={resource.name}
          href={resource.url}
        />
      ))}
      {competition.eventorLink && (
        <CompetitionSectionItem
          icon={ExternalLink}
          title="Visa tävling på Eventor"
          href={competition.eventorLink}
        />
      )}
    </CompetitionSection>
  );
};

export default CompetitionLinksSection;
