
import React, { useState } from 'react';
import { CompetitionDetail } from '../types';
import { Calendar, Clock, MapPin, User, Globe, Award } from 'lucide-react';
import FileItem from './FileItem';
import WaitlistForm from './WaitlistForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

interface CompetitionDetailsProps {
  competition: CompetitionDetail;
  onSignUpComplete: () => void;
}

const CompetitionDetails: React.FC<CompetitionDetailsProps> = ({ 
  competition, 
  onSignUpComplete 
}) => {
  const [isWaitlisted, setIsWaitlisted] = useState(competition.isWaitlisted || false);
  const { toast } = useToast();
  
  // Format date to be more readable using Swedish format
  const formattedDate = new Date(competition.date).toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleWaitlistComplete = () => {
    setIsWaitlisted(true);
    // We can still call onSignUpComplete to update the parent component's state if needed
    onSignUpComplete();
  };
  
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
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={16} className="mr-2" />
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
      
      {/* Registration section */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2">Anmälan</h3>
        <p className="text-gray-600 mb-4">
          Anmälningsdeadline: {new Date(competition.registrationDeadline).toLocaleDateString('sv-SE')}
        </p>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 mb-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>Anmälan är inte öppen ännu</span>
          </div>
        </div>
        
        {isWaitlisted ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-800">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle mr-2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Du är på väntelistan - vi meddelar dig när anmälan öppnar</span>
            </div>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full bg-primary hover:bg-forest-dark text-white py-2 px-4 rounded transition-colors">
                Ställ dig på väntelistan
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Väntelista för {competition.name}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-gray-600 mb-4">
                  Anmälan är inte öppen ännu. Fyll i dina uppgifter för att ställa dig på väntelistan. 
                  Vi meddelar dig när det är möjligt att anmäla sig.
                </p>
                <WaitlistForm 
                  competitionId={competition.id} 
                  onComplete={handleWaitlistComplete} 
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default CompetitionDetails;
