import React from 'react';
import { Competition, ResourceType } from '../types';
import { Users, Car, Link as LinkIcon, FileText, Navigation, BarChart2, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translateDiscipline, translateCompetitionType } from '../utils/translations';
import { formatSwedishDate } from '../utils/dateUtils';
import FileItem from './FileItem';

interface CompetitionDetailsProps {
  competition: Competition;
}

const CompetitionDetails: React.FC<CompetitionDetailsProps> = ({ competition }) => {
  const formattedDate = formatSwedishDate(competition.date, 'EEEE d MMMM yyyy');
  
  const invitation = competition.resources?.find(r => r.type === ResourceType.Invitation);
  const pm = competition.resources?.find(r => r.type === ResourceType.PM);
  const results = competition.resources?.filter(r => 
    r.type === ResourceType.Results || r.type === ResourceType.Splits
  );
  const otherResources = competition.resources?.filter(r => 
    r.type !== ResourceType.Invitation && 
    r.type !== ResourceType.PM && 
    r.type !== ResourceType.Results &&
    r.type !== ResourceType.Splits
  );

  const getDirectionsUrl = () => {
    if (!competition.latitude || !competition.longitude) return null;
    return `https://www.google.com/maps/dir/?api=1&destination=${competition.latitude},${competition.longitude}`;
  };
  
  const directionsUrl = getDirectionsUrl();

  return (
    <div className="space-y-6">
      <div className="bg-primary text-white p-5 rounded-lg shadow-md relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary-foreground/10"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-primary-foreground/10"></div>
        <h2 className="text-xl font-bold relative z-10">{competition.name}</h2>
        <p className="text-sm text-white/80 relative z-10">{competition.club}</p>
        <div className="mt-3 inline-block bg-white/20 px-3 py-1 rounded-full text-sm relative z-10">
          {translateCompetitionType(competition.competitionType)} • {translateDiscipline(competition.discipline)}
        </div>
      </div>

      {(invitation || pm) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
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
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="divide-y divide-gray-100">
          <Link 
            to={`/competition/${competition.id}/participants`}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <Users size={20} className="text-forest" />
              <span className="font-medium">Anmälda deltagare</span>
            </div>
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
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
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
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
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </Link>

          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <Navigation size={20} className="text-forest" />
                <span className="font-medium">Vägbeskrivning</span>
              </div>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </a>
          )}

          {competition.latitude && competition.longitude && (
            <Link 
              to={`/competition/${competition.id}/map`}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <Map size={20} className="text-forest" />
                <span className="font-medium">Visa karta</span>
              </div>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </Link>
          )}

          {otherResources && otherResources.map((resource) => (
            <div key={resource.id}>
              <FileItem file={resource} />
            </div>
          ))}
        </div>
      </div>

      {results && results.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BarChart2 className="text-forest" size={20} />
              <h3 className="font-semibold">Resultat</h3>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {results.map((result) => (
              <div key={result.id}>
                <FileItem file={result} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionDetails;
