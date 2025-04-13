
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import OrienteeringCheckpointIcon from './OrienteeringCheckpointIcon';

interface CompetitionLocationMapProps {
  locationName: string;
  className?: string;
  coordinates?: { lat: number; lng: number };
}

const CompetitionLocationMap: React.FC<CompetitionLocationMapProps> = ({ 
  locationName, 
  className,
  coordinates = { lat: 59.334591, lng: 18.063240 } // Default to Stockholm
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isShowingPlace, setIsShowingPlace] = useState(false);
  
  useEffect(() => {
    // In a real application, we would initialize a map library here
    // For this demonstration, we'll use enhanced styling for the placeholder map
    
    // Simulate loading the map
    const timer = setTimeout(() => {
      setIsShowingPlace(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [coordinates]);

  return (
    <div 
      className={cn("relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden shadow-inner", className)} 
      ref={mapRef}
    >
      {/* Enhanced map styling with topographic features */}
      <div className="absolute inset-0">
        {/* Map grid lines */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-gray-200/60"></div>
          ))}
        </div>
        
        {/* Contour lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,20 C20,10 40,30 60,20 S80,10 100,20" fill="none" stroke="#777" strokeWidth="0.5" />
          <path d="M0,30 C30,20 50,40 70,30 S90,20 100,30" fill="none" stroke="#777" strokeWidth="0.5" />
          <path d="M0,50 C20,40 40,60 60,50 S80,40 100,50" fill="none" stroke="#777" strokeWidth="0.5" />
          <path d="M0,70 C30,60 50,80 70,70 S90,60 100,70" fill="none" stroke="#777" strokeWidth="0.5" />
        </svg>
      </div>
      
      {/* Placeholder terrain features */}
      <div className="absolute inset-0">
        {/* Forest area */}
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/5 bg-green-900/10 rounded-full"></div>
        
        {/* Water body */}
        <div className="absolute bottom-1/3 right-1/3 w-1/4 h-1/6 bg-blue-400/20 rounded-lg"></div>
        
        {/* Open area */}
        <div className="absolute top-1/2 right-1/4 w-1/5 h-1/5 bg-yellow-100/20 rounded-full"></div>
        
        {/* Path */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-amber-700/20"></div>
        <div className="absolute top-1/3 left-0 w-[2px] h-full bg-amber-700/20"></div>
      </div>
      
      {/* Checkpoint marker with animation */}
      <div 
        className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700",
          isShowingPlace ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex flex-col items-center">
          <div className="relative">
            <OrienteeringCheckpointIcon size={32} className="mb-1" />
            {/* Pulsing effect */}
            <div className="absolute -inset-2 bg-primary/20 rounded-full animate-ping opacity-75" style={{ animationDuration: '3s' }}></div>
          </div>
          <div className="bg-white/90 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm mt-2">
            {locationName}
          </div>
        </div>
      </div>
      
      {/* North indicator */}
      <div className="absolute top-2 right-2 flex flex-col items-center bg-white/80 p-1 rounded-full shadow-sm">
        <div className="text-xs font-bold text-gray-700">N</div>
        <div className="h-4 w-[2px] bg-gray-700"></div>
      </div>
      
      {/* Map watermark */}
      <div className="absolute bottom-2 right-2 text-gray-500 text-xs bg-white/80 px-2 py-0.5 rounded-full">
        Arena Location
      </div>
    </div>
  );
};

export default CompetitionLocationMap;
