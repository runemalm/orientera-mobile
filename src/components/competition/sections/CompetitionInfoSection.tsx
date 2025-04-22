
import React from 'react';
import { Competition, Resource, ResourceType } from '@/types';
import { CircleAlert, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CompetitionInfoSectionProps {
  competition: Competition;
}

const CompetitionInfoSection: React.FC<CompetitionInfoSectionProps> = ({ competition }) => {
  const invitation = competition.resources?.find(r => r.type === ResourceType.Invitation);
  const pm = competition.resources?.find(r => r.type === ResourceType.PM);

  if (!invitation && !pm) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <CircleAlert className="text-forest" size={20} />
          <h3 className="font-semibold">Tävlingsinformation</h3>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {invitation && (
          <div>
            <Link
              key={invitation.id}
              to={invitation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-forest" />
                <span className="font-medium">{invitation.name}</span>
              </div>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </Link>
          </div>
        )}
        {pm && (
          <div>
            <Link
              key={pm.id}
              to={pm.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-forest" />
                <span className="font-medium">{pm.name}</span>
              </div>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionInfoSection;
