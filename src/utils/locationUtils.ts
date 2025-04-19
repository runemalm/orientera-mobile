
import { formatDistance } from './distanceUtils';

/**
 * Get a formatted location string based on available data
 * @param location Text location if available
 * @param latitude Coordinate latitude
 * @param longitude Coordinate longitude
 * @returns Formatted location string
 */
export const getFormattedLocation = (
  location: string | null | undefined,
  latitude: number | null | undefined,
  longitude: number | null | undefined
): string => {
  if (location && location.trim().length > 0) {
    return location;
  }

  if (latitude && longitude) {
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }

  return 'Ingen plats angiven';
};

/**
 * Check if valid coordinates exist
 */
export const hasValidCoordinates = (
  latitude: number | null | undefined,
  longitude: number | null | undefined
): boolean => {
  return latitude != null && longitude != null;
};

