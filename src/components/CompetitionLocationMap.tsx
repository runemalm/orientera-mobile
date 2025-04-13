
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';
import OrienteeringCheckpointIcon from './OrienteeringCheckpointIcon';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

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
  // Create a custom div icon using our OrienteeringCheckpointIcon component
  const createCustomMarkerIcon = () => {
    // We need to create a DOM element for the custom icon
    const customIconDiv = document.createElement('div');
    customIconDiv.style.width = '32px';
    customIconDiv.style.height = '32px';
    customIconDiv.style.position = 'relative';
    
    // Create a shadow element for the marker
    const shadowDiv = document.createElement('div');
    shadowDiv.style.position = 'absolute';
    shadowDiv.style.bottom = '-4px';
    shadowDiv.style.left = '50%';
    shadowDiv.style.transform = 'translateX(-50%)';
    shadowDiv.style.width = '20px';
    shadowDiv.style.height = '6px';
    shadowDiv.style.borderRadius = '50%';
    shadowDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
    shadowDiv.style.zIndex = '1';
    
    // We'll render our React component into this div later
    const iconContainer = document.createElement('div');
    iconContainer.style.position = 'absolute';
    iconContainer.style.top = '-16px';
    iconContainer.style.left = '0';
    iconContainer.style.zIndex = '2';
    
    customIconDiv.appendChild(shadowDiv);
    customIconDiv.appendChild(iconContainer);
    
    // Create the Leaflet icon
    return L.divIcon({
      html: customIconDiv,
      className: 'custom-orienteering-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // Create position array from coordinates
  const position: [number, number] = [coordinates.lat, coordinates.lng];
  const customIcon = createCustomMarkerIcon();

  return (
    <div 
      className={cn("relative w-full h-48 rounded-lg overflow-hidden shadow-inner", className)}
    >
      <MapContainer 
        // Use proper props for MapContainer
        className="h-full w-full rounded-lg"
        zoom={13} 
        center={position}
        zoomControl={false}
      >
        <TileLayer
          // Use proper props for TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker 
          // Use proper props for Marker
          position={position}
          icon={customIcon}
        >
          <Popup>
            {locationName}
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* Map watermark */}
      <div className="absolute bottom-2 right-2 text-gray-500 text-xs bg-white/80 px-2 py-0.5 rounded-full z-[1000]">
        Arena Location
      </div>
      
      <div className="absolute bottom-2 left-2 z-[1000]">
        <div className="bg-white/80 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
          {locationName}
        </div>
      </div>
      
      {/* North Indicator */}
      <div className="absolute top-2 right-2 flex flex-col items-center bg-white/80 p-1 rounded-full shadow-sm z-[1000]">
        <div className="text-xs font-bold text-gray-700">N</div>
        <div className="h-4 w-[2px] bg-gray-700"></div>
      </div>
    </div>
  );
};

export default CompetitionLocationMap;
