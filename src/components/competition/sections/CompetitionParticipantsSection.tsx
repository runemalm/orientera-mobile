
import React from 'react';
import { Competition } from '@/types';
import { Users, Car, Map, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hasValidCoordinates } from '@/utils/locationUtils';
import { useQuery } from '@tanstack/react-query';

interface CompetitionParticipantsSectionProps {
  competition: Competition;
}

const CompetitionParticipantsSection: React.FC<CompetitionParticipantsSectionProps> = ({ competition }) => {
  const { data: availableSeats = 0 } = useQuery({
    queryKey: ['carpooling-seats', competition.id],
    queryFn: async () => {
      return 0;
    }
  });

  const directionsUrl = hasValidCoordinates(competition.latitude, competition.longitude)
    ? `https://www.google.com/maps/dir/?api=1&destination=${competition.latitude},${competition.longitude}`
    : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Users className="text-forest" size={20} />
          <h3 className="font-semibold">Deltagare och samåkning</h3>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        <Link 
          to={`/competition/${competition.id}/participants`}
          className="flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <Users size={20} className="text-forest" />
            <span className="font-medium">Anmälda deltagare</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{competition.participantCount || 0}</span>
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </div>
        </Link>
        
        <Link 
          to={`/competition/${competition.id}/club-participants`}
          className="flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <Users size={20} className="text-blue-600" />
            <span className="font-medium">Klubbanmälda</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{competition.clubParticipantCount || 0}</span>
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </div>
        </Link>
        
        <Link 
          to={`/competition/${competition.id}/carpooling`}
          className="flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <Car size={20} className="text-forest" />
            <span className="font-medium">Samåkning</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{availableSeats}</span>
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </div>
        </Link>

        {hasValidCoordinates(competition.latitude, competition.longitude) && (
          <Link 
            to={`/competition/${competition.id}/map`}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <Map size={20} className="text-forest" />
              <span className="font-medium">Visa på karta</span>
            </div>
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </Link>
        )}

        {directionsUrl && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <Navigation size={20} className="text-forest" />
              <span className="font-medium">Vägbeskrivning i Google Maps</span>
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

export default CompetitionParticipantsSection;
