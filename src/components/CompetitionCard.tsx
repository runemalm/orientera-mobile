
import React from 'react';
import { Competition } from '../types';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format, differenceInDays } from 'date-fns';

interface CompetitionCardProps {
  competition: Competition;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/competition/${competition.id}`);
  };

  // Calculate days remaining
  const competitionDate = new Date(competition.date);
  const today = new Date();
  const daysRemaining = differenceInDays(competitionDate, today);
  
  // Format the date
  const formattedDate = format(competitionDate, 'E d MMM');

  return (
    <Card 
      className="bg-white shadow-sm overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md transition-shadow" 
      onClick={handleCardClick}
    >
      <CardContent className="p-3">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-800 line-clamp-1">{competition.name}</h3>
            <Badge variant="outline" className="bg-location-light/20 text-location-dark px-2 border-0">
              {competition.distance} km
            </Badge>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-1">
              {daysRemaining > 0 ? (
                <span className="text-primary flex items-center">
                  <Clock size={14} className="mr-1" />
                  {daysRemaining} {daysRemaining === 1 ? 'dag' : 'dagar'}
                </span>
              ) : daysRemaining === 0 ? (
                <span className="text-secondary flex items-center">
                  <Clock size={14} className="mr-1" />
                  Idag
                </span>
              ) : (
                <span className="text-gray-400 flex items-center">
                  <Clock size={14} className="mr-1" />
                  Avslutad
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
            <MapPin size={14} />
            <span className="line-clamp-1">{competition.club}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitionCard;
