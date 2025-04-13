
import { Competition, CompetitionSummary } from "../types";
import { mockCompetitions, mockCompetitionDetails } from "../utils/mockData";

// Configuration to determine whether to use mock data or real API
// In production, this would be set to false
const USE_MOCK_API = false;

// Base URL for the API - updated with the correct base URL without the endpoint path
const API_BASE_URL = 'https://orientera-backend.delightfulisland-78f87004.northeurope.azurecontainerapps.io/api';

/**
 * Get nearby competitions based on location and optional filters
 */
export const getNearbyCompetitions = async (
  latitude: number, 
  longitude: number,
  options?: {
    from?: Date,
    to?: Date,
    maxDistanceKm?: number,
    limit?: number
  }
): Promise<CompetitionSummary[]> => {
  if (USE_MOCK_API) {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockCompetitions;
  }
  
  // Build query parameters
  const params = new URLSearchParams();
  params.append('lat', latitude.toString());
  params.append('lng', longitude.toString());
  
  // Add optional parameters if provided
  if (options?.from) {
    // Format date as YYYY-MM-DD for DateOnly parameter
    const fromDate = options.from.toISOString().split('T')[0];
    params.append('from', fromDate);
  }
  
  if (options?.to) {
    // Format date as YYYY-MM-DD for DateOnly parameter
    const toDate = options.to.toISOString().split('T')[0];
    params.append('to', toDate);
  }
  
  if (options?.maxDistanceKm) {
    params.append('maxDistanceKm', options.maxDistanceKm.toString());
  }
  
  if (options?.limit) {
    params.append('limit', options.limit.toString());
  }
  
  // Real API call implementation
  try {
    const response = await fetch(
      `${API_BASE_URL}/competitions/get-competition-summaries?${params.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch nearby competitions:', error);
    throw error;
  }
};

/**
 * Get competition details by ID
 */
export const getCompetitionById = async (id: string): Promise<Competition | null> => {
  if (USE_MOCK_API) {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCompetitionDetails[id] || null;
  }
  
  // Real API call implementation
  try {
    const response = await fetch(
      `${API_BASE_URL}/competitions/get-competition?id=${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch competition with ID ${id}:`, error);
    throw error;
  }
};
