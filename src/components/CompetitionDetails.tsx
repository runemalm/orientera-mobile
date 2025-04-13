import React from 'react';
import { Competition, ResourceType } from '../types';
import { Users, Map, FileText, Car, Trophy, Clock, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import FileItem from './FileItem';
import { translateDiscipline, translateCompetitionType } from '../utils/translations';
import CompetitionDetailSection from './CompetitionDetailSection';

interface CompetitionDetailsProps {
  competition: Competition;
}

const CompetitionDetails: React.FC<CompetitionDetailsProps> = ({ competition }) => {
  // Format date to be more readable using Swedish format
  const formattedDate = new Date(competition.date).toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Group resources by type for easier display
  const resources = competition.resources || [];
  
  // Find specific resources by their type
  const invitation = resources.find(r => r.type === ResourceType.Invitation);
  const pm = resources.find(r => r.type === ResourceType.PM);
  const results = resources.find(r => r.type === ResourceType.Results);
  const startList = resources.find(r => r.type === ResourceType.StartList);
  const clubStartList = resources.find(r => r.type === ResourceType.ClubStartList);
  const splits = resources.find(r => r.type === ResourceType.Splits);
  
  // All other resources that don't fit in the categories above
  const otherResources = resources.filter(r => 
    ![ResourceType.Invitation, ResourceType.PM, ResourceType.Results, 
      ResourceType.StartList, ResourceType.ClubStartList, ResourceType.Splits].includes(r.type)
  );

  return (
    <div className="space-y-4">
      {/* Competition header - redesigned with more visual appeal */}
      <div className="bg-primary text-white p-5 rounded-lg shadow-md relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary-foreground/10"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-primary-foreground/10"></div>
        <h2 className="text-xl font-bold relative z-10">{competition.name}</h2>
        <p className="text-sm text-white/80 relative z-10">{competition.club}</p>
        <div className="mt-3 inline-block bg-white/20 px-3 py-1 rounded-full text-sm relative z-10">
          {translateCompetitionType(competition.competitionType)} • {translateDiscipline(competition.discipline)}
        </div>
      </div>
      
      {/* Key info panel */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <p className="text-xs text-gray-500 uppercase">Datum</p>
          <p className="font-semibold text-center">{new Date(competition.date).toLocaleDateString('sv-SE', {
            day: 'numeric',
            month: 'short'
          })}</p>
        </div>
        
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <p className="text-xs text-gray-500 uppercase">Startar</p>
          <p className="font-semibold">{competition.startTime || 'Inte angivet'}</p>
        </div>
        
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center col-span-2">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{competition.location || 'Plats inte angiven'}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">{competition.distance} km från dig</p>
        </div>
      </div>
      
      {/* Competition resources section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Official competition documents */}
        {invitation && (
          <FileItem key={invitation.id} file={invitation} />
        )}
        
        {pm && (
          <>
            {invitation && <Separator />}
            <FileItem key={pm.id} file={pm} />
          </>
        )}
        
        {/* Participant lists */}
        <Link 
          to={`/competition/${competition.id}/participants`}
          className="flex items-center justify-between p-4 hover:bg-gray-50"
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
        
        {/* Club participants */}
        <Separator />
        <Link 
          to={`/competition/${competition.id}/club-participants`}
          className="flex items-center justify-between p-4 hover:bg-gray-50"
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
        
        {/* Start lists */}
        {startList && (
          <>
            <Separator />
            <FileItem key={startList.id} file={startList} />
          </>
        )}
        
        {clubStartList && (
          <>
            <Separator />
            <FileItem key={clubStartList.id} file={clubStartList} />
          </>
        )}
        
        {/* Results and splits */}
        {results && (
          <>
            <Separator />
            <FileItem key={results.id} file={results} />
          </>
        )}
        
        {splits && (
          <>
            <Separator />
            <FileItem key={splits.id} file={splits} />
          </>
        )}
        
        {/* Livelox section */}
        {competition.liveloxLink && (
          <>
            <Separator />
            <a 
              href={competition.liveloxLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Map size={20} className="text-forest" />
                <span className="font-medium">Livelox</span>
              </div>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </div>
            </a>
          </>
        )}
        
        {/* Carpooling section */}
        <Separator />
        <Link 
          to={`/competition/${competition.id}/carpooling`}
          className="flex items-center justify-between p-4 hover:bg-gray-50"
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
      </div>
      
      {/* Other documents and links section */}
      {otherResources.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Dokument & länkar</h3>
          <div className="space-y-2">
            {otherResources.map((resource) => (
              <FileItem key={resource.id} file={resource} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionDetails;
