
import React from 'react';
import { Competition, Resource, ResourceType, ResourceFormat } from '@/types';
import { ExternalLink, FileText, Link2 } from 'lucide-react';
import LinkListItem from '../LinkListItem';

interface CompetitionLinksSectionProps {
  competition: Competition;
}

const CompetitionLinksSection: React.FC<CompetitionLinksSectionProps> = ({ competition }) => {
  const otherResources = competition.resources?.filter(r =>
    r.type === ResourceType.Other
  );

  if (!otherResources?.length && !competition.eventorLink) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Link2 className="text-forest" size={20} />
          <h3 className="font-semibold">Övriga dokument och länkar</h3>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {otherResources?.map((resource) => (
          <LinkListItem
            key={resource.id}
            icon={resource.format === ResourceFormat.Link ? ExternalLink : FileText}
            title={resource.name}
            href={resource.url}
          />
        ))}
        {competition.eventorLink && (
          <LinkListItem
            icon={ExternalLink}
            title="Visa tävling på Eventor"
            href={competition.eventorLink}
          />
        )}
      </div>
    </div>
  );
};

export default CompetitionLinksSection;
