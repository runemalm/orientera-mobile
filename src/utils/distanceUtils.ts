
/**
 * Calculate distance between two points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number | null, 
  lon1: number | null, 
  lat2: number | null, 
  lon2: number | null
): number {
  // If any coordinate is null, return a default value
  if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) {
    return 0;
  }
  
  // Earth's radius in kilometers
  const R = 6371;
  
  // Convert latitude and longitude from degrees to radians
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  // Haversine formula
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  // Round to 1 decimal place
  return Math.round(distance * 10) / 10;
}

/**
 * Format distance in a user-friendly way
 * @param distance Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance} km`;
}
