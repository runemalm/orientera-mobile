
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
      zoomControl: false,  // Disable default zoom control so we can reposition it
      attributionControl: false,  // Disable attribution completely
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
    
    // Add the OpenStreetMap tile layer without attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''  // Empty attribution
    }).addTo(map);

    // Add zoom control to the bottom-left corner
    L.control.zoom({
      position: 'bottomleft'
    }).addTo(map);

    console.log(`Adding ${competitions.length} competition markers to map...`);
    
    // Create bounds array to hold coordinates for fitting
    const boundsCoords: L.LatLngExpression[] = [];
    
    // Add markers for each competition with coordinates
    competitions.forEach((competition, index) => {
      if (competition.latitude && competition.longitude) {
        console.log(`Adding marker ${index+1}:`, competition.name, competition.latitude, competition.longitude);
        
        // Add point to bounds array
        boundsCoords.push([competition.latitude, competition.longitude]);
        
        // Create marker with custom icon
        const customMarkerIcon = createOrienteeringMarkerIcon();
        
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
    
    // Important: Style all marker icons AFTER they've been added to the map
    setTimeout(() => {
      console.log('Styling markers...');
      document.querySelectorAll('.checkpoint-icon-container').forEach((container, index) => {
        console.log(`Styling marker ${index+1}`);
        styleOrienteeringMarker(container);
      });
    }, 100);
    
    // Fit map to bounds with some padding if we have points
    if (boundsCoords.length > 0) {
      console.log(`Fitting map to ${boundsCoords.length} points`);
      const bounds = L.latLngBounds(boundsCoords);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // Fallback to Sweden's center if no competitions found
      console.log('No coordinates to fit, centering on Sweden');
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
      .custom-orienteering-marker {
        background: transparent;
        border: none;
      }
      /* Custom styles for zoom controls in the bottom-left */
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
    </div>
  );
};

export default CompetitionsMap;
