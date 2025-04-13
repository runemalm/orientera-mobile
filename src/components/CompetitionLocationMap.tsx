
import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import OrienteeringCheckpointIcon from './OrienteeringCheckpointIcon';

interface CompetitionLocationMapProps {
  locationName: string;
  className?: string;
  // In a real application we would use actual coordinates
  // For demonstration, we'll use placeholder values
  coordinates?: { lat: number; lng: number };
}

const CompetitionLocationMap: React.FC<CompetitionLocationMapProps> = ({ 
  locationName, 
  className,
  coordinates = { lat: 59.334591, lng: 18.063240 } // Default to Stockholm
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // In a real application, we would initialize a map library here
    // For this demonstration, we'll use a placeholder map with styling
    
    // For a real implementation, you would use a library like Mapbox, Leaflet, or Google Maps
    // Example for Mapbox:
    // if (mapRef.current && mapboxgl) {
    //   mapboxgl.accessToken = 'your-access-token';
    //   const map = new mapboxgl.Map({
    //     container: mapRef.current,
    //     style: 'mapbox://styles/mapbox/outdoors-v11',
    //     center: [coordinates.lng, coordinates.lat],
    //     zoom: 13
    //   });
    //   
    //   // Add the checkpoint marker
    //   const markerEl = document.createElement('div');
    //   ReactDOM.render(<OrienteeringCheckpointIcon size={32} />, markerEl);
    //   new mapboxgl.Marker(markerEl).setLngLat([coordinates.lng, coordinates.lat]).addTo(map);
    // }
  }, [coordinates]);

  return (
    <div 
      className={cn("relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden", className)} 
      ref={mapRef}
    >
      {/* Placeholder map styling */}
      <div className="absolute inset-0 bg-gray-100 opacity-70">
        {/* Map grid lines */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border border-gray-200"></div>
          ))}
        </div>
      </div>
      
      {/* Placeholder terrain features */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/5 bg-forest-light/20 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1/4 h-1/6 bg-blue-200/30 rounded-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-1/5 h-1/5 bg-green-200/20 rounded-full"></div>
      </div>
      
      {/* Checkpoint marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center">
          <OrienteeringCheckpointIcon size={32} className="mb-1" />
          <div className="bg-white/80 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
            {locationName}
          </div>
        </div>
      </div>
      
      {/* Map watermark */}
      <div className="absolute bottom-2 right-2 text-gray-500 text-xs">
        Arena Location
      </div>
    </div>
  );
};

export default CompetitionLocationMap;
