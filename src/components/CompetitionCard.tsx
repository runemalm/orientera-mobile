
import React from 'react';
import { CompetitionSummary } from '../types';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface CompetitionCardProps {
  competition: CompetitionSummary;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/competition/${competition.id}`);
  };

  const competitionDate = new Date(competition.date);
  const today = new Date();
  const daysRemaining = differenceInDays(competitionDate, today);
  
  const formattedDate = format(competitionDate, 'E d MMM');

  const getStatusInfo = () => {
    if (daysRemaining > 7) {
      return { 
        color: "bg-gray-100 text-gray-700",
        text: `${daysRemaining} dagar kvar`
      };
    } else if (daysRemaining > 1) {
      return {
        color: "bg-blue-100 text-blue-700", 
        text: `${daysRemaining} dagar kvar`
      };
    } else if (daysRemaining === 1) {
      return {
        color: "bg-blue-200 text-blue-800",
        text: "Imorgon"
      };
    } else if (daysRemaining === 0) {
      return {
        color: "bg-green-100 text-green-700",
        text: "Idag"
      };
    } else {
      return {
        color: "bg-gray-100 text-gray-500",
        text: "Avslutad"
      };
    }
  };

  const status = getStatusInfo();

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`;
    }
    return `${distance} km`;
  };

  // Function to translate enum values to Swedish for display
  const getSwedishDiscipline = (discipline: string): string => {
    switch (discipline) {
      case 'Sprint': return 'Sprint';
      case 'Middle': return 'Medel';
      case 'Long': return 'Lång';
      case 'Night': return 'Natt';
      case 'Relay': return 'Stafett';
      case 'UltraLong': return 'Ultralång';
      case 'PreO': return 'PreO';
      case 'TempO': return 'TempO';
      default: return discipline;
    }
  };

  const getSwedishCompetitionType = (type: string): string => {
    switch (type) {
      case 'Championship': return 'Mästerskap';
      case 'National': return 'Nationell tävling';
      case 'Regional': return 'Regional tävling';
      case 'Near': return 'Närtävling';
      case 'Club': return 'Klubbtävling';
      case 'Weekly': return 'Veckotävling';
      default: return type;
    }
  };

  return (
    <Card 
      className="bg-white shadow-sm overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md transition-shadow" 
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="outline" className={cn("px-3 py-1 gap-1 font-medium", status.color)}>
              <Clock size={14} />
              {status.text}
            </Badge>
            
            <Badge variant="outline" className="bg-forest-light/20 text-forest-dark px-3 py-1 gap-1 font-medium border-0">
              <Navigation size={14} />
              {formatDistance(competition.distance)}
            </Badge>
          </div>
          
          <h3 className="font-medium text-gray-800 text-lg">{competition.name}</h3>
          
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar size={14} className="text-primary" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin size={14} className="text-forest" />
              <span className="line-clamp-1">{competition.club}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitionCard;
