
/**
 * Formats a district name by removing the "OF" suffix
 * @param district Full district name
 * @returns Simplified district name
 */
export const formatDistrictName = (district: string): string => {
  return district.replace(' OF', '');
};
