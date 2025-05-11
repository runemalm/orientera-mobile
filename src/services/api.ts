import { Competition, CompetitionSummary, CompetitionOrderBy, OrderDirection } from "../types";
import { mockCompetitions, mockCompetitionDetails } from "../utils/mockData";

// Configuration to determine whether to use mock data or real API
const USE_MOCK_API = false; // Set to false to use real API

// Base URL for the API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Get competition summaries based on provided filters
 */
export const getNearbyCompetitions = async (
  from?: Date,
  to?: Date,
  lat?: number,
  lng?: number,
  maxDistanceKm?: number,
  limit?: number,
  branches?: string[],
  disciplines?: string[],
  competitionTypes?: string[],
  districts?: string[],
  clubs?: string[],
  orderBy?: CompetitionOrderBy,
  orderDirection?: OrderDirection
): Promise<CompetitionSummary[]> => {
  console.log('API getNearbyCompetitions called with params:', { 
    from, to, lat, lng, maxDistanceKm, limit, 
    branches, disciplines, competitionTypes, districts, 
    clubs, orderBy, orderDirection 
  });
  
  if (USE_MOCK_API) {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Using mock data for competitions');
    
    // Return mock data (no local filtering since we want to match API behavior)
    return mockCompetitions;
  }
  
  // Real API implementation
  try {
    console.log('Making real API request for competitions');
    const params = new URLSearchParams();
    
    // Add date filters
    if (from instanceof Date) {
      params.append('from', from.toISOString().split('T')[0]);
    }
    
    if (to instanceof Date) {
      params.append('to', to.toISOString().split('T')[0]);
    }
    
    // Add location parameters
    if (lat !== undefined) {
      params.append('lat', lat.toString());
    }
    
    if (lng !== undefined) {
      params.append('lng', lng.toString());
    }
    
    // Add distance parameter
    if (maxDistanceKm !== undefined) {
      params.append('maxDistanceKm', maxDistanceKm.toString());
    }
    
    // Add limit parameter
    if (limit !== undefined) {
      params.append('limit', limit.toString());
    }
    
    // Add filter parameters
    if (branches && branches.length > 0) {
      branches.forEach(branch => {
        params.append('branches', branch);
      });
    }
    
    if (disciplines && disciplines.length > 0) {
      disciplines.forEach(discipline => {
        params.append('disciplines', discipline);
      });
    }
    
    if (competitionTypes && competitionTypes.length > 0) {
      competitionTypes.forEach(type => {
        params.append('competitionTypes', type);
      });
    }

    if (districts && districts.length > 0) {
      districts.forEach(district => {
        params.append('districts', district);
      });
    }
    
    // Add clubs filter parameter
    if (clubs && clubs.length > 0) {
      clubs.forEach(club => {
        params.append('clubs', club);
      });
    }
    
    // Add sorting parameters
    if (orderBy) {
      params.append('orderBy', orderBy);
    }
    
    if (orderDirection) {
      params.append('orderDirection', orderDirection);
    }
    
    const apiUrl = `${API_BASE_URL}/competitions/get-competition-summaries?${params.toString()}`;
    console.log('API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('API error:', response.status);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Received ${data.length} competitions from API`);
    return data;
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
