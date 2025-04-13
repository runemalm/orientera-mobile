import React from 'react';
import { CompetitionSummary } from '../types';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { translateDiscipline, translateCompetitionType } from '../utils/translations';
import { useUserLocation } from '../hooks/useUserLocation';
import { calculateDistance, formatDistance } from '../utils/distanceUtils';
import { formatSwedishDate, getDaysRemaining } from '../utils/dateUtils';

interface CompetitionCardProps {
  competition: CompetitionSummary;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition }) => {
  const navigate = useNavigate();
  const { userLocation } = useUserLocation();
  
  const handleCardClick = () => {
    navigate(`/competition/${competition.id}`);
  };

  const daysRemaining = getDaysRemaining(competition.date);
  const formattedDate = formatSwedishDate(competition.date, 'E d MMM');

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

  // Calculate the distance between competition and user location
  const distance = calculateDistance(
    userLocation?.latitude || null,
    userLocation?.longitude || null,
    competition.latitude,
    competition.longitude
  );

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
              {formatDistance(distance)}
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
