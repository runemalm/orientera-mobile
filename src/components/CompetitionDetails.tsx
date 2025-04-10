
import React, { useState } from 'react';
import { CompetitionDetail } from '../types';
import { Calendar, Clock, MapPin, User, Globe } from 'lucide-react';
import FileItem from './FileItem';
import SignUpForm from './SignUpForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CompetitionDetailsProps {
  competition: CompetitionDetail;
  onSignUpComplete: () => void;
}

const CompetitionDetails: React.FC<CompetitionDetailsProps> = ({ 
  competition, 
  onSignUpComplete 
}) => {
  const [isRegistered, setIsRegistered] = useState(competition.isRegistered || false);
  
  // Format date to be more readable
  const formattedDate = new Date(competition.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleSignUpComplete = () => {
    setIsRegistered(true);
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
          <span>Start time: {competition.startTime}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={16} className="mr-2" />
          <span>{competition.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <User size={16} className="mr-2" />
          <span>Organized by: {competition.club}</span>
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
              Visit website
            </a>
          </div>
        )}
      </div>
      
      {/* Disciplines */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Disciplines</h3>
        <div className="flex flex-wrap gap-2">
          {competition.disciplines.map((discipline, index) => (
            <span 
              key={index}
              className="bg-forest-light/20 text-forest-dark px-3 py-1 rounded-full text-sm"
            >
              {discipline.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>
      
      {/* Description */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
        <p className="text-gray-600">{competition.description}</p>
      </div>
      
      {/* Files */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Files</h3>
        <div className="space-y-2">
          {competition.files.length > 0 ? (
            competition.files.map((file) => (
              <FileItem key={file.id} file={file} />
            ))
          ) : (
            <p className="text-gray-500">No files available yet</p>
          )}
        </div>
      </div>
      
      {/* Registration section */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2">Registration</h3>
        <p className="text-gray-600 mb-4">
          Registration deadline: {new Date(competition.registrationDeadline).toLocaleDateString()}
        </p>
        
        {isRegistered ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-800">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle mr-2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>You are registered for this competition</span>
            </div>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full bg-primary hover:bg-forest-dark text-white py-2 px-4 rounded transition-colors">
                Sign up for competition
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Register for {competition.name}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <SignUpForm 
                  competitionId={competition.id} 
                  onSignUpComplete={handleSignUpComplete} 
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
