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
    
    // When using mock data, apply local filtering
    let filteredData = [...mockCompetitions];
    
    if (from) {
      filteredData = filteredData.filter(comp => new Date(comp.date) >= from);
    }
    
    if (to) {
      filteredData = filteredData.filter(comp => new Date(comp.date) <= to);
    }
    
    if (disciplines && disciplines.length > 0) {
      filteredData = filteredData.filter(comp => 
        disciplines.includes(comp.discipline)
      );
    }
    
    if (branches && branches.length > 0) {
      filteredData = filteredData.filter(comp => 
        branches.includes(comp.branch)
      );
    }
    
    if (competitionTypes && competitionTypes.length > 0) {
      filteredData = filteredData.filter(comp => 
        competitionTypes.includes(comp.competitionType)
      );
    }
    
    if (districts && districts.length > 0) {
      filteredData = filteredData.filter(comp => 
        districts.includes(comp.district)
      );
    }
    
    if (clubs && clubs.length > 0) {
      filteredData = filteredData.filter(comp => 
        clubs.includes(comp.club)
      );
    }
    
    // Apply distance filtering if location is provided
    if (lat !== undefined && lng !== undefined && maxDistanceKm !== undefined) {
      filteredData = filteredData.filter(comp => {
        if (!comp.latitude || !comp.longitude) return false;
        
        // Calculate distance between competition and provided coordinates
        const R = 6371; // Earth's radius in km
        const dLat = (comp.latitude - lat) * Math.PI / 180;
        const dLon = (comp.longitude - lng) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat * Math.PI / 180) * Math.cos(comp.latitude * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return distance <= maxDistanceKm;
      });
    }
    
    // Apply limit if provided
    if (limit !== undefined && limit > 0) {
      filteredData = filteredData.slice(0, limit);
    }
    
    return filteredData;
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
    
    const apiUrl = `${API_BASE_URL}/competitions/search-competition-summaries?${params.toString()}`;
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
