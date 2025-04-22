
import React from 'react';
import { Competition, Resource, ResourceType } from '@/types';
import { BarChart2, ExternalLink, FileText } from 'lucide-react';
import LinkListItem from '../LinkListItem';

interface CompetitionResultsSectionProps {
  competition: Competition;
}

const CompetitionResultsSection: React.FC<CompetitionResultsSectionProps> = ({ competition }) => {
  const results = competition.resources?.filter(r => 
    r.type === ResourceType.Results || 
    r.type === ResourceType.Splits
  );

  if (!results?.length && !competition.liveloxLink) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <BarChart2 className="text-forest" size={20} />
          <h3 className="font-semibold">Resultat och analys</h3>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {results?.map((result) => (
          <LinkListItem
            key={result.id}
            icon={FileText}
            title={result.name}
            href={result.url}
          />
        ))}
        {competition.liveloxLink && (
          <LinkListItem
            icon={ExternalLink}
            title="Banor och rutter på Livelox"
            href={competition.liveloxLink}
          />
        )}
      </div>
    </div>
  );
};

export default CompetitionResultsSection;
