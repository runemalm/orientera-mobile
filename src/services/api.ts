
import { Competition, CompetitionSummary } from "../types";
import { mockCompetitions, mockCompetitionDetails } from "../utils/mockData";

// Configuration to determine whether to use mock data or real API
// In production, this would be set to false
const USE_MOCK_API = false;

// Base URL for the API - updated with the real API URL 
const API_BASE_URL = 'https://orientera-backend.delightfulisland-78f87004.northeurope.azurecontainerapps.io/api/competitions';

/**
 * Get nearby competitions based on location
 */
export const getNearbyCompetitions = async (
  latitude: number, 
  longitude: number
): Promise<CompetitionSummary[]> => {
  if (USE_MOCK_API) {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockCompetitions;
  }
  
  // Real API call implementation
  try {
    const response = await fetch(
      `${API_BASE_URL}/get-competitions?lat=${latitude}&lon=${longitude}`,
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
      `${API_BASE_URL}/get-competitions/${id}`,
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
