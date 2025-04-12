
// Enums to match backend C# models
export enum Branch {
  FootO = 'FootO',    // Orienteringslöpning
  PreO = 'PreO',     // Precisionsorientering
  MTBO = 'MTBO',     // Mountainbikeorientering
  SkiO = 'SkiO',     // Skidorientering
  TrailO = 'TrailO'   // Trail-O
}

export enum CompetitionType {
  Championship = 'Championship',
  National = 'National',
  Regional = 'Regional',
  Near = 'Near',
  Club = 'Club',
  Weekly = 'Weekly'
}

export enum Discipline {
  Sprint = 'Sprint',
  Middle = 'Middle',
  Long = 'Long',
  Night = 'Night',
  Relay = 'Relay',
  UltraLong = 'UltraLong',
  PreO = 'PreO',
  TempO = 'TempO'
}

export enum OrienteeringDistrict {
  Blekinge = 'Blekinge OF',
  Bohuslan = 'Bohuslän-Dals OF',
  Dalarna = 'Dalarnas OF',
  Gotland = 'Gotlands OF',
  Gavleborg = 'Gävleborgs OF',
  Halland = 'Hallands OF',
  Haninge = 'Haninge SOK',
  Jamtland = 'Jämtland-Härjedalens OF',
  Jonkoping = 'Jönköpings läns OF',
  Norrbotten = 'Norrbottens OF',
  Skane = 'Skånes OF',
  Smaland = 'Smålands OF',
  Stockholm = 'Stockholms OF',
  Sodermanland = 'Södermanlands OF',
  Uppland = 'Upplands OF',
  Varmland = 'Värmlands OF',
  Vasterbotten = 'Västerbottens OF',
  Vastergotland = 'Västergötlands OF',
  Vasternorrland = 'Västernorrlands OF',
  Vastmanland = 'Västmanlands OF',
  Orebro = 'Örebro Läns OF',
  Ostergotland = 'Östergötlands OF'
}

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

// Renamed Competition to CompetitionSummary
export interface CompetitionSummary {
  id: string;
  name: string;
  date: string;
  location: string;
  distance: number; // Distance in km from user's location
  club: string;
  description: string;
  discipline: Discipline; // Changed to enum type
  competitionType: CompetitionType; // Changed to enum type
  district: OrienteeringDistrict; // Changed to enum type
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Updated Competition to match C# backend DTO
export interface Competition extends Omit<CompetitionSummary, 'discipline' | 'competitionType' | 'district' | 'coordinates'> {
  eventorId: string;
  discipline: Discipline; // Changed to enum type
  competitionType: CompetitionType; // Changed to enum type
  district: OrienteeringDistrict; // Changed to enum type
  branch: Branch; // Changed to enum type
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
  type: ResourceType; // Already an enum
  format: ResourceFormat; // Already an enum
  url: string;
  uploadDate: string; // Keeping as string for now, will need conversion for backend communication
}
