
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompetitionFilterBadgesProps {
  location: string;
  onChangeLocation: () => void;
}

const CompetitionFilterBadges: React.FC<CompetitionFilterBadgesProps> = ({
  location,
  onChangeLocation,
}) => {
  if (!location) return null;
  
  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      <Badge variant="secondary" className="flex items-center gap-1.5 pl-2 pr-1">
        <MapPin className="h-3 w-3" />
        <span>{location}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 p-0.5 hover:bg-secondary-dark/20"
          onClick={onChangeLocation}
        >
          <X className="h-3 w-3" />
        </Button>
      </Badge>
    </div>
  );
};

export default CompetitionFilterBadges;
