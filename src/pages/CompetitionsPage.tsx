
import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import CompetitionCard from '../components/CompetitionCard';
import { mockCompetitions } from '../utils/mockData';
import { Search, MapPin } from 'lucide-react';

const CompetitionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCompetitions = mockCompetitions.filter(comp => 
    comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.club.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MobileLayout title="Tävlingar i närheten">
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Sök tävlingar..."
            className="pl-10 w-full p-3 bg-white border border-gray-200 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center mb-4">
        <MapPin size={16} className="text-primary mr-1" />
        <span className="text-sm text-gray-600">Visar tävlingar nära din position</span>
      </div>
      
      <div>
        {filteredCompetitions.length > 0 ? (
          filteredCompetitions.map(competition => (
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
