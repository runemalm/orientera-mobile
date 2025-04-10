
import React from 'react';
import { CompetitionDetail } from '../types';
import { Calendar, Clock, MapPin, User, Globe, Award } from 'lucide-react';
import FileItem from './FileItem';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { useToast } from '@/hooks/use-toast';

interface CompetitionDetailsProps {
  competition: CompetitionDetail;
  onSignUpComplete: () => void;
}

const CompetitionDetails: React.FC<CompetitionDetailsProps> = ({ 
  competition, 
  onSignUpComplete 
}) => {
  const { toast } = useToast();
  
  // Format date to be more readable using Swedish format
  const formattedDate = new Date(competition.date).toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-2">{competition.name}</h2>
        <div className="flex items-center text-gray-600 mb-2">
          <Calendar size={16} className="mr-2" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <Clock size={16} className="mr-2" />
          <span>Starttid: {competition.startTime}</span>
        </div>
        <div className="flex items-center text-location-dark mb-2">
          <MapPin size={16} className="mr-2 text-location" />
          <span>{competition.location}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <Award size={16} className="mr-2" />
          <span>{competition.competitionType} | {competition.district}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <User size={16} className="mr-2" />
          <span>Arrangör: {competition.club}</span>
        </div>
        {competition.website && (
          <div className="flex items-center text-gray-600 mt-2">
            <Globe size={16} className="mr-2" />
            <a 
              href={competition.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Besök webbplats
            </a>
          </div>
        )}
      </div>
      
      {/* Discipline */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Disciplin</h3>
        <div className="flex flex-wrap gap-2">
          <span className="bg-forest-light/20 text-forest-dark px-3 py-1 rounded-full text-sm">
            {competition.discipline}
          </span>
        </div>
      </div>
      
      {/* Description */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Beskrivning</h3>
        <p className="text-gray-600">{competition.description}</p>
      </div>
      
      {/* Files */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Dokument</h3>
        <div className="space-y-2">
          {competition.files.length > 0 ? (
            competition.files.map((file) => (
              <FileItem key={file.id} file={file} />
            ))
          ) : (
            <p className="text-gray-500">Inga dokument tillgängliga ännu</p>
          )}
        </div>
      </div>
      
      {/* Registration deadline section - simplified without registration status */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2">Anmälan</h3>
        <p className="text-gray-600">
          Anmälningsdeadline: {new Date(competition.registrationDeadline).toLocaleDateString('sv-SE')}
        </p>
      </div>
    </div>
  );
};

export default CompetitionDetails;
