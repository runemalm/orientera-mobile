
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

// Updated Resource interface to match backend C# model
export interface Resource {
  id: string; // Using id for client-side instead of EventorId for backward compatibility
  eventorId?: string; // Optional to match backend
  name: string;
  type: ResourceType;
  format: ResourceFormat;
  url: string;
  uploadDate: string; // Keeping as string for now, will need conversion for backend communication
}

// Add enums for Resource Type and Format to match backend
export enum ResourceType {
  StartList = 'StartList',
  Results = 'Results',
  Splits = 'Splits',
  Invitation = 'Invitation',
  PM = 'PM',
  Other = 'Other'
}

export enum ResourceFormat {
  Link = 'Link',
  Pdf = 'Pdf',
  Png = 'Png'
}

export type TabName = 'competitions' | 'info';
