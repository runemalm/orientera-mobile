
import React from 'react';
import { CompetitionDetail } from '../types';
import { Calendar, Clock, MapPin, User, Globe, Award, Navigation, FileText, Info, Tag, Map } from 'lucide-react';
import FileItem from './FileItem';
import { formatDistrictName } from '../utils/formatters';

interface CompetitionDetailsProps {
  competition: CompetitionDetail;
}

const CompetitionDetails: React.FC<CompetitionDetailsProps> = ({ 
  competition
}) => {
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
  
  return (
    <div className="space-y-2">
      {/* Competition header */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold">{competition.name}</h2>
        <p className="text-sm text-gray-500">{competition.club}</p>
      </div>
      
      {/* Main info list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          <li className="p-3 flex items-center gap-3">
            <Calendar size={18} className="text-forest shrink-0" />
            <div>
              <span className="text-sm font-medium text-gray-700">Datum</span>
              <p className="text-gray-600">{formattedDate}</p>
            </div>
          </li>
          
          <li className="p-3 flex items-center gap-3">
            <Clock size={18} className="text-forest shrink-0" />
            <div>
              <span className="text-sm font-medium text-gray-700">Starttid</span>
              <p className="text-gray-600">{competition.startTime}</p>
            </div>
          </li>
          
          <li className="p-3 flex items-center gap-3">
            <MapPin size={18} className="text-location shrink-0" />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">Plats</span>
              <p className="text-gray-600">{competition.location}</p>
            </div>
            <span className="flex items-center gap-1 text-gray-500">
              <Navigation size={16} />
              <span>{competition.distance} km</span>
            </span>
          </li>
          
          <li className="p-3 flex items-center gap-3">
            <Tag size={18} className="text-forest shrink-0" />
            <div>
              <span className="text-sm font-medium text-gray-700">Disciplin</span>
              <p className="text-gray-600">{competition.discipline}</p>
            </div>
          </li>
          
          <li className="p-3 flex items-center gap-3">
            <Award size={18} className="text-forest shrink-0" />
            <div>
              <span className="text-sm font-medium text-gray-700">Tävlingstyp</span>
              <p className="text-gray-600">
                {competition.competitionType} • {competition.district}
              </p>
            </div>
          </li>
          
          <li className="p-3 flex items-center gap-3">
            <Calendar size={18} className="text-red-500 shrink-0" />
            <div>
              <span className="text-sm font-medium text-gray-700">Anmälningsstopp</span>
              <p className="text-gray-600">{registrationDate}</p>
            </div>
          </li>
          
          {competition.website && (
            <li className="p-3 flex items-center gap-3">
              <Globe size={18} className="text-forest shrink-0" />
              <div>
                <span className="text-sm font-medium text-gray-700">Webbplats</span>
                <p>
                  <a 
                    href={competition.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Besök tävlingswebbplats
                  </a>
                </p>
              </div>
            </li>
          )}
        </ul>
      </div>
      
      {/* Livelox section - Now separate from main info */}
      {competition.liveloxLink && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Map size={18} className="text-location" />
              <h3 className="font-semibold text-gray-700">Livelox</h3>
            </div>
          </div>
          <ul className="divide-y divide-gray-100">
            <li className="p-3 flex items-center gap-3">
              <Map size={18} className="text-location shrink-0" />
              <div>
                <span className="text-sm font-medium text-gray-700">Livelox</span>
                <p>
                  <a 
                    href={competition.liveloxLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Karta, banor och rutter i Livelox
                  </a>
                </p>
              </div>
            </li>
          </ul>
        </div>
      )}
      
      {/* Description */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Info size={18} className="text-forest" />
          <h3 className="font-semibold text-gray-700">Beskrivning</h3>
        </div>
        <p className="text-gray-600 pl-6">{competition.description}</p>
      </div>
      
      {/* Documents & Links - Updated to match styling */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-forest" />
            <h3 className="font-semibold text-gray-700">Dokument & Länkar</h3>
          </div>
        </div>
        <div className="p-3">
          {competition.files.length > 0 ? (
            <div className="space-y-2">
              {competition.files.map((file) => (
                <FileItem key={file.id} file={file} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Inga dokument tillgängliga ännu</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetails;
