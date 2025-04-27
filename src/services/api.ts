
import { Competition, CompetitionSummary } from "../types";
import { mockCompetitions, mockCompetitionDetails } from "../utils/mockData";

// Configuration to determine whether to use mock data or real API
const USE_MOCK_API = false; // Set to false to use real API

// Base URL for the API
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
    limit?: number,
    districts?: string[],
    disciplines?: string[],
    competitionTypes?: string[],
    branches?: string[]
  }
): Promise<CompetitionSummary[]> => {
  console.log('API getNearbyCompetitions called with:', { latitude, longitude, options });
  
  if (USE_MOCK_API) {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Using mock data for competitions');
    
    // Filter mock competitions based on date range if provided
    let filteredCompetitions = [...mockCompetitions];
    
    if (options?.from) {
      const fromDate = options.from instanceof Date ? options.from.toISOString().split('T')[0] : options.from;
      filteredCompetitions = filteredCompetitions.filter(comp => 
        comp.date >= fromDate
      );
    }
    
    if (options?.to) {
      const toDate = options.to instanceof Date ? options.to.toISOString().split('T')[0] : options.to;
      filteredCompetitions = filteredCompetitions.filter(comp => 
        comp.date <= toDate
      );
    }
    
    if (options?.districts && options.districts.length > 0) {
      filteredCompetitions = filteredCompetitions.filter(comp => 
        options.districts!.includes(comp.district)
      );
    }
    
    if (options?.disciplines && options.disciplines.length > 0) {
      filteredCompetitions = filteredCompetitions.filter(comp => 
        options.disciplines!.includes(comp.discipline)
      );
    }
    
    if (options?.competitionTypes && options.competitionTypes.length > 0) {
      filteredCompetitions = filteredCompetitions.filter(comp => 
        options.competitionTypes!.includes(comp.competitionType)
      );
    }

    if (options?.branches && options.branches.length > 0) {
      filteredCompetitions = filteredCompetitions.filter(comp => 
        options.branches!.includes(comp.branch)
      );
    }
    
    // Apply distance filter if provided and location filter is enabled
    if (options?.maxDistanceKm) {
      console.log('Applying distance filter with max distance:', options.maxDistanceKm);
      // This is a simplified version, real distance calculation would be more complex
      filteredCompetitions = filteredCompetitions.filter(comp => {
        if (comp.latitude === null || comp.longitude === null) return true;
        
        // Simple distance calculation (this is not accurate for real-world use)
        const latDiff = Math.abs(comp.latitude - latitude);
        const lonDiff = Math.abs(comp.longitude - longitude);
        const approxDistKm = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111; // rough km conversion
        
        return approxDistKm <= options.maxDistanceKm;
      });
    }
    
    if (options?.limit) {
      filteredCompetitions = filteredCompetitions.slice(0, options.limit);
    }
    
    console.log(`Returning ${filteredCompetitions.length} mock competitions after filtering`);
    return filteredCompetitions;
  }
  
  // Real API implementation
  try {
    console.log('Making real API request for competitions');
    const params = new URLSearchParams();
    params.append('latitude', latitude.toString());
    params.append('longitude', longitude.toString());
    
    if (options?.from instanceof Date) {
      params.append('from', options.from.toISOString().split('T')[0]);
    }
    
    if (options?.to instanceof Date) {
      params.append('to', options.to.toISOString().split('T')[0]);
    }
    
    if (options?.maxDistanceKm) {
      params.append('maxDistanceKm', options.maxDistanceKm.toString());
      console.log('Added maxDistanceKm to API request:', options.maxDistanceKm);
    }
    
    if (options?.limit) {
      params.append('limit', options.limit.toString());
    }
    
    // Add filter parameters
    if (options?.districts && options.districts.length > 0) {
      options.districts.forEach(district => {
        params.append('districts', district);
      });
    }
    
    if (options?.disciplines && options.disciplines.length > 0) {
      options.disciplines.forEach(discipline => {
        params.append('disciplines', discipline);
      });
    }
    
    if (options?.competitionTypes && options.competitionTypes.length > 0) {
      options.competitionTypes.forEach(type => {
        params.append('competitionTypes', type);
      });
    }

    if (options?.branches && options.branches.length > 0) {
      options.branches.forEach(branch => {
        params.append('branches', branch);
      });
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
