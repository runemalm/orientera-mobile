
import React from 'react';
import { Competition, Resource, ResourceType } from '@/types';
import { CircleAlert, FileText } from 'lucide-react';
import LinkListItem from '../LinkListItem';

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
          <LinkListItem
            icon={FileText}
            title={invitation.name}
            href={invitation.url}
          />
        )}
        {pm && (
          <LinkListItem
            icon={FileText}
            title={pm.name}
            href={pm.url}
          />
        )}
      </div>
    </div>
  );
};

export default CompetitionInfoSection;
