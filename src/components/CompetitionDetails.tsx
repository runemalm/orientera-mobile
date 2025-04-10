
import React from 'react';
import { CompetitionDetail } from '../types';
import { Calendar, Clock, MapPin, User, Globe, Award, Navigation } from 'lucide-react';
import FileItem from './FileItem';
import { formatDistrictName } from '../utils/formatters';
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';

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
  
  return (
    <div className="space-y-5">
      {/* Main info card */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <h2 className="text-2xl font-bold">{competition.name}</h2>
          <p className="text-sm text-gray-500">{competition.club}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Date and time */}
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={18} className="text-forest" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={18} className="text-forest" />
            <span>Starttid: {competition.startTime}</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin size={18} className="text-gray-600" />
            <span>{competition.location}</span>
            <span className="ml-auto flex items-center gap-1 text-gray-600">
              <Navigation size={16} />
              <span>{competition.distance} km</span>
            </span>
          </div>
          
          {/* Competition type and district */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Badge variant="outline" className="bg-forest-light/10 text-forest-dark">
              {competition.competitionType}
            </Badge>
            <Badge variant="outline" className="bg-forest-light/10 text-forest-dark">
              {competition.district}
            </Badge>
          </div>
          
          {/* Website link */}
          {competition.website && (
            <div className="pt-1">
              <a 
                href={competition.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Globe size={16} />
                <span>Besök tävlingswebbplats</span>
              </a>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Discipline */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-1">
          <h3 className="font-semibold text-gray-700">Disciplin</h3>
        </CardHeader>
        <CardContent>
          <Badge className="bg-forest text-white">
            {competition.discipline}
          </Badge>
        </CardContent>
      </Card>
      
      {/* Description */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-1">
          <h3 className="font-semibold text-gray-700">Beskrivning</h3>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{competition.description}</p>
        </CardContent>
      </Card>
      
      {/* Documents */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-1">
          <h3 className="font-semibold text-gray-700">Dokument</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {competition.files.length > 0 ? (
              competition.files.map((file) => (
                <FileItem key={file.id} file={file} />
              ))
            ) : (
              <p className="text-gray-500">Inga dokument tillgängliga ännu</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Registration deadline section */}
      <Card className="border-none shadow-md bg-forest-light/10 mt-6">
        <CardContent className="p-4">
          <div className="flex flex-col">
            <h3 className="font-semibold mb-1">Anmälan</h3>
            <p className="text-sm text-gray-600">
              Anmälningsstopp: {new Date(competition.registrationDeadline).toLocaleDateString('sv-SE')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitionDetails;
