
import React, { useRef, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';
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
      zoomControl: true,
      attributionControl: true,
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
    
    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Create a custom icon for the marker
    const customMarkerIcon = L.divIcon({
      className: 'custom-orienteering-marker',
      html: '<div class="checkpoint-icon-container"></div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    
    // Add a marker at the specified coordinates
    const marker = L.marker([coordinates.lat, coordinates.lng], { 
      icon: customMarkerIcon
    }).addTo(map);
    
    // Ensure the map is centered on the marker coordinates and revalidate size
    setTimeout(() => {
      map.invalidateSize();
      map.setView([coordinates.lat, coordinates.lng], 13);
    }, 100);
    
    // After the marker is added, we can render our React component into the container
    if (document.querySelector('.checkpoint-icon-container')) {
      const iconContainer = document.querySelector('.checkpoint-icon-container');
      if (iconContainer) {
        iconContainer.innerHTML = `
          <div style="position: relative; width: 20px; height: 20px;">
            <div style="position: absolute; inset: 0; border: 2px solid #666; border-radius: 2px;"></div>
            <div style="position: absolute; inset: 0; clip-path: polygon(0 0, 100% 0, 0 100%); background-color: #FFFFFF;"></div>
            <div style="position: absolute; inset: 0; clip-path: polygon(100% 0, 0 100%, 100% 100%); background-color: #F97316;"></div>
          </div>
          <div style="position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); width: 20px; height: 6px; border-radius: 50%; background-color: rgba(0,0,0,0.2); z-index: 1;"></div>
        `;
      }
    }
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates]);

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div ref={mapRef} className="h-full w-full z-10"></div>
      
      {/* Map UI elements with lower z-index to ensure they don't overlap with tabs */}
      <div className="absolute bottom-2 right-2 text-gray-500 text-xs bg-white/80 px-2 py-0.5 rounded-full z-[40]">
        <span role="complementary">© OpenStreetMap</span>
      </div>
      
      <div className="absolute bottom-2 left-2 z-[40]">
        <div className="bg-white/80 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
          {locationName}
        </div>
      </div>
      
      {/* North Indicator */}
      <div className="absolute top-2 right-2 flex flex-col items-center bg-white/80 p-1 rounded-full shadow-sm z-[40]">
        <div className="text-xs font-bold text-gray-700">N</div>
        <div className="h-4 w-[2px] bg-gray-700"></div>
      </div>
    </div>
  );
};

export default CompetitionLocationMap;

