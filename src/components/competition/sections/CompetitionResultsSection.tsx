
import React from 'react';
import { Competition, Resource, ResourceType } from '@/types';
import { BarChart2, FileText, ExternalLink } from 'lucide-react';
import CompetitionSection from '../details/CompetitionSection';
import CompetitionSectionItem from '../details/CompetitionSectionItem';

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
    <CompetitionSection icon={BarChart2} title="Resultat och analys">
      {results?.map((result) => (
        <CompetitionSectionItem
          key={result.id}
          icon={FileText}
          title={result.name}
          href={result.url}
          count={result.count}
        />
      ))}
      {competition.liveloxLink && (
        <CompetitionSectionItem
          icon={ExternalLink}
          title="Banor och rutter på Livelox"
          href={competition.liveloxLink}
        />
      )}
    </CompetitionSection>
  );
};

export default CompetitionResultsSection;
