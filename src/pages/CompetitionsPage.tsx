
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionCard from '../components/CompetitionCard';
import { mockCompetitions } from '../utils/mockData';
import { MapPin } from 'lucide-react';

const CompetitionsPage: React.FC = () => {
  return (
    <MobileLayout title="Tävlingar i närheten">
      <div className="bg-white rounded-lg p-3 mb-4 shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="bg-primary/10 rounded-full p-2 mr-3">
            <MapPin size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Visar tävlingar nära dig</p>
            <p className="text-xs text-gray-500">Baserat på din nuvarande position</p>
          </div>
        </div>
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
