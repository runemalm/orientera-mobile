
import L from 'leaflet';

/**
 * Creates an orienteering checkpoint styled marker for maps
 * 
 * @param iconContainer The DOM element to style as an orienteering checkpoint
 */
export const styleOrienteeringMarker = (iconContainer: Element): void => {
  if (iconContainer) {
    iconContainer.innerHTML = `
      <div style="position: relative; width: 24px; height: 24px;">
        <div style="position: absolute; inset: 0; border: 2px solid #666; border-radius: 2px; transform: rotate(45deg);"></div>
        <div style="position: absolute; inset: 0; clip-path: polygon(0 0, 100% 0, 0 100%); background-color: #FFFFFF; transform: rotate(45deg);"></div>
        <div style="position: absolute; inset: 0; clip-path: polygon(100% 0, 0 100%, 100% 100%); background-color: #F97316; transform: rotate(45deg);"></div>
      </div>
      <div style="position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); width: 20px; height: 6px; border-radius: 50%; background-color: rgba(0,0,0,0.2); z-index: 1;"></div>
    `;
  }
};

/**
 * Creates a custom orienteering marker icon for Leaflet maps
 * 
 * @returns L.DivIcon A Leaflet divIcon configured for orienteering checkpoints
 */
export const createOrienteeringMarkerIcon = (): L.DivIcon => {
  return L.divIcon({
    className: 'custom-orienteering-marker',
    html: '<div class="checkpoint-icon-container"></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  });
};
