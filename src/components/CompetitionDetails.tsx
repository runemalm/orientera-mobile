import React from 'react';
import { Competition, ResourceType } from '../types';
import { Users, Map, FileText, Car, Trophy, Clock, List, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
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

  // Check if we have official documents
  const hasOfficialDocs = invitation || pm || startList || clubStartList || results || splits;
  
  // Check if we have event links
  const hasEventLinks = competition.liveloxLink || competition.eventorLink;

  return (
    <div className="space-y-6">
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
          <div className="text-primary mb-1">
            <Calendar size={18} />
          </div>
          <p className="text-xs text-gray-500 uppercase">Datum</p>
          <p className="font-semibold text-center">{new Date(competition.date).toLocaleDateString('sv-SE', {
            day: 'numeric',
            month: 'short'
          })}</p>
        </div>
        
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="text-primary mb-1">
            <Clock size={18} />
          </div>
          <p className="text-xs text-gray-500 uppercase">Startar</p>
          <p className="font-semibold">{competition.startTime || 'Inte angivet'}</p>
        </div>
        
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center col-span-2">
          <div className="text-primary mb-1">
            <MapPin size={18} />
          </div>
          <p className="font-semibold">{competition.location || 'Plats inte angiven'}</p>
          <p className="text-xs text-gray-500 mt-1">{competition.distance} km från dig</p>
        </div>
      </div>
      
      {/* Tabs for resources and info */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">Dokument</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="space-y-4 pt-2">
          {/* Official competition documents */}
          <Card className="border border-gray-100">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {invitation && (
                  <FileItem key={invitation.id} file={invitation} />
                )}
                
                {pm && (
                  <FileItem key={pm.id} file={pm} />
                )}
                
                {startList && (
                  <FileItem key={startList.id} file={startList} />
                )}
                
                {clubStartList && (
                  <FileItem key={clubStartList.id} file={clubStartList} />
                )}
                
                {results && (
                  <FileItem key={results.id} file={results} />
                )}
                
                {splits && (
                  <FileItem key={splits.id} file={splits} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Links to pages */}
          <Card className="border border-gray-100">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
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
            </CardContent>
          </Card>
          
          {/* External links section */}
          {hasEventLinks && (
            <Card className="border border-gray-100">
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {competition.liveloxLink && (
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
                  )}
                  
                  {competition.eventorLink && (
                    <a 
                      href={competition.eventorLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <Trophy size={20} className="text-amber-500" />
                        <span className="font-medium">Eventor</span>
                      </div>
                      <div className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 7h10v10" />
                          <path d="M7 17 17 7" />
                        </svg>
                      </div>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Other documents and links section */}
          {otherResources.length > 0 && (
            <Card className="border border-gray-100">
              <CardContent className="p-3">
                <h3 className="font-semibold text-gray-700 mb-3">Övriga dokument & länkar</h3>
                <div className="space-y-2 divide-y divide-gray-100">
                  {otherResources.map((resource) => (
                    <FileItem key={resource.id} file={resource} className="pt-2 first:pt-0" />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="info" className="space-y-4 pt-2">
          {/* Basic competition info */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {competition.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Beskrivning</h3>
                    <p>{competition.description}</p>
                  </div>
                )}
                
                {competition.registrationDeadline && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Sista anmälningsdag</h3>
                    <p>{new Date(competition.registrationDeadline).toLocaleDateString('sv-SE')}</p>
                  </div>
                )}
                
                {competition.contact && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Kontakt</h3>
                    <p>{competition.contact}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompetitionDetails;
