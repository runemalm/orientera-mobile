
import React, { useRef, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';
import L from 'leaflet';
import { createOrienteeringMarkerIcon, styleOrienteeringMarker } from '../utils/mapUtils';

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
  coordinates: { lat: number; lng: number };
}

const CompetitionLocationMap: React.FC<CompetitionLocationMapProps> = ({ 
  locationName, 
  className,
  coordinates
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Create a map instance centered on the competition coordinates
    const map = L.map(mapRef.current, {
      center: [coordinates.lat, coordinates.lng],
      zoom: 13,
      zoomControl: false, // Disable default zoom control
      attributionControl: false, // Disable attribution completely
      doubleClickZoom: true,
      scrollWheelZoom: true, // Enable mouse wheel zoom
      boxZoom: true,
      touchZoom: true, // Enable pinch-to-zoom on mobile
      dragging: true,
      keyboard: true,
      tap: true
    });
    
    // Save the map instance for cleanup
    mapInstanceRef.current = map;
    
    // Add the OpenStreetMap tile layer without attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '' // Empty attribution
    }).addTo(map);
    
    // Add zoom control to the bottom-left corner
    L.control.zoom({
      position: 'bottomleft'
    }).addTo(map);
    
    // Create a custom icon for the marker
    const customMarkerIcon = createOrienteeringMarkerIcon();
    
    // Add a marker at the specified coordinates
    const marker = L.marker([coordinates.lat, coordinates.lng], { 
      icon: customMarkerIcon
    }).addTo(map);
    
    // Ensure the map is centered on the marker coordinates and revalidate size
    setTimeout(() => {
      map.invalidateSize();
      map.setView([coordinates.lat, coordinates.lng], 13);
    }, 100);
    
    // After the marker is added, we can style our React component into the container
    if (document.querySelector('.checkpoint-icon-container')) {
      const iconContainer = document.querySelector('.checkpoint-icon-container');
      if (iconContainer) {
        styleOrienteeringMarker(iconContainer);
      }
    }
    
    // Add CSS for styling the zoom controls
    const style = document.createElement('style');
    style.innerHTML = `
      .leaflet-bottom.leaflet-left .leaflet-control-zoom {
        margin-bottom: 15px;
        margin-left: 15px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        border-radius: 8px;
        overflow: hidden;
      }
      .leaflet-control-zoom a {
        line-height: 26px !important;
        height: 26px !important;
        width: 26px !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates]);

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div ref={mapRef} className="h-full w-full z-10"></div>
      <div className="absolute bottom-2 left-2 z-[40]">
        <div className="bg-white/80 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
          {locationName}
        </div>
      </div>
    </div>
  );
};

export default CompetitionLocationMap;
