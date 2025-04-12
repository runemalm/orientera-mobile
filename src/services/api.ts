
import { Competition, CompetitionSummary, Branch, CompetitionType, Discipline, OrienteeringDistrict, ResourceType, ResourceFormat } from "../types";
import { mockCompetitions, mockCompetitionDetails } from "../utils/mockData";

// Configuration to determine whether to use mock data or real API
// In production, this would be set to false
const USE_MOCK_API = true;

// Base URL for the API - real API URL
const API_BASE_URL = 'http://api.orientera.com/api';

/**
 * Helper functions to ensure proper mapping between API string values and our enums
 */
const mapToBranch = (value: string | null): Branch | null => {
  if (!value) return null;
  
  // Handle potential casing differences or alternative API representations
  switch (value.toLowerCase()) {
    case 'footo': return Branch.FootO;
    case 'preo': return Branch.PreO;
    case 'mtbo': return Branch.MTBO;
    case 'skio': return Branch.SkiO;
    case 'trailo': return Branch.TrailO;
    default: return null;
  }
};

const mapToCompetitionType = (value: string | null): CompetitionType | null => {
  if (!value) return null;
  
  switch (value.toLowerCase()) {
    case 'championship': return CompetitionType.Championship;
    case 'national': return CompetitionType.National;
    case 'regional': return CompetitionType.Regional;
    case 'near': return CompetitionType.Near;
    case 'club': return CompetitionType.Club;
    case 'weekly': return CompetitionType.Weekly;
    default: return null;
  }
};

const mapToDiscipline = (value: string | null): Discipline | null => {
  if (!value) return null;
  
  switch (value.toLowerCase()) {
    case 'sprint': return Discipline.Sprint;
    case 'middle': return Discipline.Middle;
    case 'long': return Discipline.Long;
    case 'night': return Discipline.Night;
    case 'relay': return Discipline.Relay;
    case 'ultralong': return Discipline.UltraLong;
    case 'preo': return Discipline.PreO;
    case 'tempo': return Discipline.TempO;
    default: return null;
  }
};

const mapToOrienteeringDistrict = (value: string | null): OrienteeringDistrict | null => {
  if (!value) return null;
  
  // Handle case where API sends "SmålandsOF" but our enum has "Smaland"
  if (value.toLowerCase() === 'smålandsof') return OrienteeringDistrict.Smaland;
  
  // Check all other district values
  for (const district in OrienteeringDistrict) {
    if (district.toLowerCase() === value?.toLowerCase()) {
      return OrienteeringDistrict[district as keyof typeof OrienteeringDistrict];
    }
  }
  
  return null;
};

const mapToResourceType = (value: string | null): ResourceType | null => {
  if (!value) return null;
  
  switch (value.toLowerCase()) {
    case 'startlist': return ResourceType.StartList;
    case 'results': return ResourceType.Results;
    case 'splits': return ResourceType.Splits;
    case 'invitation': return ResourceType.Invitation;
    case 'pm': return ResourceType.PM;
    case 'other': return ResourceType.Other;
    default: return null;
  }
};

const mapToResourceFormat = (value: string | null): ResourceFormat | null => {
  if (!value) return null;
  
  switch (value.toLowerCase()) {
    case 'link': return ResourceFormat.Link;
    case 'pdf': return ResourceFormat.Pdf;
    case 'png': return ResourceFormat.Png;
    default: return null;
  }
};

/**
 * Process API response to map string values to enums
 */
const processCompetitionResponse = (data: any): Competition => {
  return {
    ...data,
    branch: mapToBranch(data.branch) || Branch.FootO, // Default to FootO if mapping fails
    discipline: mapToDiscipline(data.discipline) || Discipline.Long,
    competitionType: mapToCompetitionType(data.competitionType) || CompetitionType.Near,
    district: mapToOrienteeringDistrict(data.district) || OrienteeringDistrict.Smaland,
    resources: data.resources?.map((resource: any) => ({
      ...resource,
      type: mapToResourceType(resource.type) || ResourceType.Other,
      format: mapToResourceFormat(resource.format) || ResourceFormat.Link
    })) || []
  };
};

const processCompetitionSummaryResponse = (data: any): CompetitionSummary => {
  return {
    ...data,
    discipline: mapToDiscipline(data.discipline) || Discipline.Long,
    competitionType: mapToCompetitionType(data.competitionType) || CompetitionType.Near,
    district: mapToOrienteeringDistrict(data.district) || OrienteeringDistrict.Smaland
  };
};

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
      `${API_BASE_URL}/competitions/get-competitions?lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    // Process each competition to ensure proper enum mapping
    return data.map((item: any) => processCompetitionSummaryResponse(item));
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
      `${API_BASE_URL}/competitions/${id}`,
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
    
    const data = await response.json();
    // Process the competition to ensure proper enum mapping
    return processCompetitionResponse(data);
  } catch (error) {
    console.error(`Failed to fetch competition with ID ${id}:`, error);
    throw error;
  }
};
