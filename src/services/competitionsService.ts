
import { Competition } from '../types';

interface ApiCompetition {
  id: string;
  eventorId: string;
  name: string;
  date: string;
  location: string;
  club: string;
  description: string;
  branch: string;
  discipline: string;
  competitionType: string;
  district: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  resources: Array<{
    eventorId: string;
    name: string;
    type: string;
    format: string;
    url: string;
    uploadDate: string;
  }>;
  registrationDeadline?: string;
  startTime?: string;
  contact: string;
  eventorLink?: string;
  liveloxLink?: string;
}

export const fetchCompetitions = async (): Promise<Competition[]> => {
  try {
    const response = await fetch('http://localhost:5268/api/competitions/get-competitions');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json() as ApiCompetition[];
    
    // Transform API data to match our frontend model
    return data.map((comp): Competition => ({
      id: comp.id,
      eventorId: comp.eventorId,
      name: comp.name,
      date: comp.date,
      location: comp.location,
      club: comp.club,
      description: comp.description,
      branch: comp.branch as any, // Type casting to match our enum
      discipline: comp.discipline as any, // Type casting to match our enum
      competitionType: comp.competitionType as any, // Type casting to match our enum
      district: comp.district as any, // Type casting to match our enum
      coordinates: comp.coordinates,
    }));
  } catch (error) {
    console.error('Error fetching competitions:', error);
    throw error;
  }
}

export const fetchCompetitionDetails = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:5268/api/competitions/get-competition/${id}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching competition details for ID ${id}:`, error);
    throw error;
  }
}
