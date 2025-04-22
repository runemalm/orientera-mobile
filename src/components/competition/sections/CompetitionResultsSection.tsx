
import React from 'react';
import { Competition, Resource, ResourceType } from '@/types';
import { BarChart2, ExternalLink } from 'lucide-react';
import FileItem from '../../FileItem';

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
          <div key={result.id}>
            <FileItem file={result} />
          </div>
        ))}
        {competition.liveloxLink && (
          <a
            href={competition.liveloxLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <ExternalLink size={20} className="text-forest" />
              <span className="font-medium">Banor och rutter på Livelox</span>
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

export default CompetitionResultsSection;
