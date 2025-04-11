
import React from 'react';
import { CompetitionDetail } from '../types';
import { 
  Calendar, Clock, MapPin, Globe, Award, Navigation, FileText, Info, 
  Users, Map, Tag, Trophy, User
} from 'lucide-react';
import FileItem from './FileItem';
import { Link } from 'react-router-dom';
import { formatDistrictName } from '../utils/formatters';
import CompetitionDetailSection from './CompetitionDetailSection';

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

  // Format registration deadline
  const registrationDate = new Date(competition.registrationDeadline).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Check if competition is in the past
  const isCompetitionInPast = new Date(competition.date) < new Date();
  
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
          <Calendar size={22} className="text-primary mb-1" />
          <p className="text-xs text-gray-500 uppercase">Datum</p>
          <p className="font-semibold text-center">{new Date(competition.date).toLocaleDateString('sv-SE', {
            day: 'numeric',
            month: 'short'
          })}</p>
        </div>
        
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <Clock size={22} className="text-primary mb-1" />
          <p className="text-xs text-gray-500 uppercase">Startar</p>
          <p className="font-semibold">{competition.startTime}</p>
        </div>
        
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center col-span-2">
          <div className="flex items-center gap-2">
            <MapPin size={22} className="text-location" />
            <p className="font-semibold">{competition.location}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">{competition.distance} km från dig</p>
        </div>
      </div>
      
      {/* Full date and deadline section */}
      <CompetitionDetailSection
        icon={<Calendar size={18} className="text-forest" />}
        title="Tidsinformation"
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Datum:</span>
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Starttid:</span>
            <span className="font-medium">{competition.startTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-red-500 flex items-center gap-1">
              <Calendar size={16} />
              <span>Anmälningsstopp:</span>
            </span>
            <span className="font-medium">{registrationDate}</span>
          </div>
        </div>
      </CompetitionDetailSection>
      
      {/* Competition type information */}
      <CompetitionDetailSection
        icon={<Trophy size={18} className="text-forest" />}
        title="Tävlingstyp"
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Typ:</span>
            <span className="font-medium">{competition.competitionType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Disciplin:</span>
            <span className="font-medium">{competition.discipline}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Distrikt:</span>
            <span className="font-medium">{competition.district}</span>
          </div>
        </div>
      </CompetitionDetailSection>
      
      {/* Description */}
      <CompetitionDetailSection
        icon={<Info size={18} className="text-forest" />}
        title="Beskrivning"
      >
        <p className="text-gray-600">{competition.description}</p>
      </CompetitionDetailSection>
      
      {/* Organizer */}
      <CompetitionDetailSection
        icon={<User size={18} className="text-forest" />}
        title="Arrangör"
        borderless={!competition.website}
      >
        <div className="text-gray-600 mb-2">{competition.club}</div>
        
        {competition.website && (
          <a 
            href={competition.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-2 mt-2"
          >
            <Globe size={16} />
            <span>Besök tävlingswebbplats</span>
          </a>
        )}
      </CompetitionDetailSection>
      
      {/* Documents & Links */}
      {competition.files.length > 0 && (
        <CompetitionDetailSection
          icon={<FileText size={18} className="text-forest" />}
          title="Dokument & Länkar"
        >
          <div className="space-y-2">
            {competition.files.map((file) => (
              <FileItem key={file.id} file={file} />
            ))}
          </div>
        </CompetitionDetailSection>
      )}
      
      {/* Registered participants section */}
      <CompetitionDetailSection
        icon={<Users size={18} className="text-forest" />}
        title="Anmälda"
        borderless
      >
        <Link 
          to={`/competition/${competition.id}/participants`}
          className="text-primary hover:underline flex items-center gap-2"
        >
          <Users size={16} />
          <span>Se anmälda deltagare</span>
        </Link>
      </CompetitionDetailSection>
      
      {/* Start Times section - only show if competition is not in the past */}
      {!isCompetitionInPast && (
        <CompetitionDetailSection
          icon={<Clock size={18} className="text-forest" />}
          title="Starttider"
          borderless
        >
          <Link 
            to={`/competition/${competition.id}/start-times`}
            className="text-primary hover:underline flex items-center gap-2"
          >
            <Clock size={16} />
            <span>Se starttider</span>
          </Link>
        </CompetitionDetailSection>
      )}
      
      {/* Livelox section */}
      {competition.liveloxLink && (
        <CompetitionDetailSection
          icon={<Map size={18} className="text-location" />}
          title="Livelox"
          borderless
        >
          <a 
            href={competition.liveloxLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-2"
          >
            <Map size={16} />
            <span>Karta, banor och rutter i Livelox</span>
          </a>
        </CompetitionDetailSection>
      )}
    </div>
  );
};

export default CompetitionDetails;
