
import React, { useRef, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { CompetitionSummary } from '../../types';
import L from 'leaflet';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { createOrienteeringMarkerIcon, styleOrienteeringMarker } from '../../utils/mapUtils';

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

interface CompetitionsMapProps {
  competitions: CompetitionSummary[];
  className?: string;
}

const CompetitionsMap: React.FC<CompetitionsMapProps> = ({ 
  competitions,
  className
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!mapRef.current || competitions.length === 0) return;
    
    // Create a map instance
    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
      doubleClickZoom: true,
      scrollWheelZoom: true,
      boxZoom: true,
      touchZoom: true,
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

    // Create a custom icon for the markers
    const customMarkerIcon = createOrienteeringMarkerIcon();
    
    // Bounds to fit all markers
    const bounds = L.latLngBounds([]);
    
    // Add markers for each competition with coordinates
    competitions.forEach(competition => {
      if (competition.latitude && competition.longitude) {
        // Add point to bounds
        bounds.extend([competition.latitude, competition.longitude]);
        
        // Create marker
        const marker = L.marker(
          [competition.latitude, competition.longitude], 
          { icon: customMarkerIcon }
        ).addTo(map);
        
        // Add popup with competition info
        marker.bindPopup(`
          <div class="competition-popup">
            <h3 class="font-medium">${competition.name}</h3>
            <p>${competition.date}</p>
            <p>${competition.location}</p>
            <button class="popup-button">Visa detaljer</button>
          </div>
        `);
        
        // Add click handler to navigate to competition details
        marker.on('popupopen', () => {
          setTimeout(() => {
            const button = document.querySelector('.popup-button');
            if (button) {
              button.addEventListener('click', () => {
                navigate(`/competition/${competition.id}`);
              });
            }
          }, 10);
        });
      }
    });
    
    // Style all orienteering markers
    document.querySelectorAll('.checkpoint-icon-container').forEach(container => {
      styleOrienteeringMarker(container);
    });
    
    // Fit map to bounds with some padding
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // Fallback to Sweden's center if no competitions found
      map.setView([62.0, 15.0], 5);
    }
    
    // Add map CSS
    const style = document.createElement('style');
    style.innerHTML = `
      .competition-popup h3 {
        font-weight: 600;
        margin-bottom: 4px;
      }
      .competition-popup p {
        margin: 2px 0;
        font-size: 14px;
      }
      .popup-button {
        background-color: #f97316;
        color: white;
        border: none;
        padding: 4px 8px;
        margin-top: 6px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      }
      .popup-button:hover {
        background-color: #ea580c;
      }
    `;
    document.head.appendChild(style);
    
    // Revalidate map size
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
    
    return () => {
      document.head.removeChild(style);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [competitions, navigate]);

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div ref={mapRef} className="h-full w-full z-10"></div>
      
      {/* Map UI elements */}
      <div className="absolute bottom-2 right-2 text-gray-500 text-xs bg-white/80 px-2 py-0.5 rounded-full z-[40]">
        <span role="complementary">© OpenStreetMap</span>
      </div>
      
      {/* Competition count */}
      <div className="absolute top-2 left-2 z-[40]">
        <div className="bg-white/90 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
          Visar {competitions.length} tävlingar
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

export default CompetitionsMap;
