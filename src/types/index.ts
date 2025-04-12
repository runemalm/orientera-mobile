
export type CompetitionType = string;
export type CompetitionDiscipline = string;
export type OrienteeringDistrict = string;

// Renamed Competition to CompetitionSummary
export interface CompetitionSummary {
  id: string;
  name: string;
  date: string;
  location: string;
  distance: number; // Distance in km from user's location
  club: string;
  description: string;
  discipline: string; // Changed to string to match backend
  competitionType: string; // Changed to string to match backend
  district: string; // Changed to string to match backend
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Updated Competition to match C# backend DTO
export interface Competition extends Omit<CompetitionSummary, 'discipline' | 'competitionType' | 'district' | 'coordinates'> {
  eventorId: string;
  discipline: string;
  competitionType: string;
  district: string;
  branch: string;
  latitude?: number;
  longitude?: number;
  registrationDeadline: string;
  startTime: string;
  contact: string;
  eventorLink?: string;
  website?: string; // Keeping for backward compatibility
  liveloxLink?: string; 
  isRegistered?: boolean;
  isWaitlisted?: boolean;
  resources: Resource[]; // Already renamed from files
}

// Resource interface (already renamed from CompetitionFile)
export interface Resource {
  id: string;
  name: string;
  type: 'startlist' | 'results' | 'splits' | 'invitation' | 'pm' | 'other';
  url: string;
  uploadDate: string;
}

export type TabName = 'competitions' | 'info';
