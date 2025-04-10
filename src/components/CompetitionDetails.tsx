
import React, { useState } from 'react';
import { CompetitionDetail } from '../types';
import { Calendar, Clock, MapPin, User, Globe, Award, ExternalLink } from 'lucide-react';
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
  const [isRegistered, setIsRegistered] = useState(competition.isRegistered || false);
  const [isWaitlisted, setIsWaitlisted] = useState(competition.isWaitlisted || false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Format date to be more readable using Swedish format
  const formattedDate = new Date(competition.date).toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleSignUpComplete = () => {
    setIsRegistered(true);
    onSignUpComplete();
  };
  
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsWaitlisted(true);
      setIsSubmitting(false);
      toast({
        title: "Du är nu på väntelistan",
        description: "Vi kommer att meddela dig när anmälan öppnar i appen.",
      });
    }, 1000);
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
        
        {isRegistered ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-800">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle mr-2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Du är anmäld till denna tävling</span>
            </div>
          </div>
        ) : isWaitlisted ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-yellow-800">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell mr-2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span>Du är på väntelistan för anmälan</span>
            </div>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full bg-primary hover:bg-forest-dark text-white py-2 px-4 rounded transition-colors">
                Anmäl dig till tävlingen
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Anmälan inte tillgänglig ännu</DialogTitle>
                <DialogDescription>
                  Anmälan via appen är inte tillgänglig ännu. Under tiden kan du anmäla dig via Eventor eller ställa dig på vår väntelista.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <Alert>
                  <AlertDescription>
                    <div className="flex flex-col space-y-2">
                      <p>Du kan anmäla dig till tävlingen via Eventor tills vidare.</p>
                      <div>
                        <a 
                          href="https://eventor.orientering.se" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline font-medium"
                        >
                          Anmäl dig på Eventor <ExternalLink size={14} className="ml-1" />
                        </a>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
                
                {!isWaitlisted ? (
                  <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Ställ dig på väntelistan
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Din e-post"
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Vi meddelar dig när anmälan via appen blir tillgänglig
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Skickar..." : "Ställ mig på väntelistan"}
                    </Button>
                  </form>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-yellow-800">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell mr-2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                      <span>Du är på väntelistan</span>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default CompetitionDetails;
