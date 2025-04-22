
import React from 'react';
import { Competition, Resource, ResourceType, ResourceFormat } from '@/types';
import { ExternalLink, FileText, Link2 } from 'lucide-react';

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
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              {resource.format === ResourceFormat.Link ? (
                <ExternalLink size={20} className="text-forest" />
              ) : (
                <FileText size={20} className="text-forest" />
              )}
              <span className="font-medium">{resource.name}</span>
            </div>
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </a>
        ))}
        {competition.eventorLink && (
          <a
            href={competition.eventorLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <ExternalLink size={20} className="text-forest" />
              <span className="font-medium">Visa tävling på Eventor</span>
            </div>
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </a>
        )}
      </div>
    </div>
  );
};

export default CompetitionLinksSection;
