
import React from 'react';
import { CompetitionSummary } from '../../types';
import CompetitionCard from '../CompetitionCard';
import { UserLocation } from '../../hooks/useUserLocation';

interface CompetitionListProps {
  competitions: CompetitionSummary[];
  userLocation: UserLocation;
}

const CompetitionList: React.FC<CompetitionListProps> = ({ competitions, userLocation }) => {
  if (competitions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </div>
        <p className="text-gray-500">Inga tävlingar hittades</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {competitions.map(competition => (
        <CompetitionCard key={competition.id} competition={competition} />
      ))}
    </div>
  );
};

export default CompetitionList;
