
import React from 'react';
import { CompetitionDetail } from '../types';
import { Users, Map, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import FileItem from './FileItem';

interface CompetitionDetailsProps {
  competition: CompetitionDetail;
}

const CompetitionDetails: React.FC<CompetitionDetailsProps> = ({ competition }) => {
  // Format date to be more readable using Swedish format
  const formattedDate = new Date(competition.date).toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <div className="space-y-4">
      {/* Competition header - redesigned with more visual appeal */}
      <div className="bg-primary text-white p-5 rounded-lg shadow-md relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary-foreground/10"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-primary-foreground/10"></div>
        <h2 className="text-xl font-bold relative z-10">{competition.name}</h2>
        <p className="text-sm text-white/80 relative z-10">{competition.club}</p>
        <div className="mt-3 inline-block bg-white/20 px-3 py-1 rounded-full text-sm relative z-10">
          {competition.competitionType} • {competition.discipline}
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
          <p className="font-semibold">{competition.startTime}</p>
        </div>
        
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center col-span-2">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{competition.location}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">{competition.distance} km från dig</p>
        </div>
      </div>
      
      {/* Simplified uniform sections */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Documents section - show files directly */}
        {competition.files.length > 0 && (
          <>
            {competition.files.map((file) => (
              <FileItem key={file.id} file={file} />
            ))}
            <Separator />
          </>
        )}
        
        {/* Registered participants */}
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
      </div>
    </div>
  );
};

export default CompetitionDetails;
