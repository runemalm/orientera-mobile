
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionCard from '../components/CompetitionCard';
import { mockCompetitions } from '../utils/mockData';
import { MapPin } from 'lucide-react';

const CompetitionsPage: React.FC = () => {
  return (
    <MobileLayout title="Tävlingar i närheten">
      <div className="flex items-center mb-4">
        <MapPin size={16} className="text-primary mr-1" />
        <span className="text-sm text-gray-600">Visar tävlingar nära din position</span>
      </div>
      
      <div>
        {mockCompetitions.length > 0 ? (
          mockCompetitions.map(competition => (
            <CompetitionCard key={competition.id} competition={competition} />
          ))
        ) : (
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
        )}
      </div>
    </MobileLayout>
  );
};

export default CompetitionsPage;
