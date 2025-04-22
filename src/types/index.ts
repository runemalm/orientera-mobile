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
  Smaland = 'SmålandsOF',  // Updated to match API format (no space)
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
  Invitation = 'Invitation',
  PM = 'PM',
  MapSample = 'MapSample',
  EntryList = 'EntryList',
  StartList = 'StartList',
  LiveResults = 'LiveResults',
  Results = 'Results',
  Splits = 'Splits',
  PressResults = 'PressResults',
  Livelox = 'Livelox',
  Other = 'Other'
}

export enum ResourceFormat {
  Link = 'Link',
  Pdf = 'Pdf',
  Png = 'Png',
  Jpeg = 'Jpeg',
  Gif = 'Gif',
  Other = 'Other'
}

// Update the TabName type to include 'settings'
export type TabName = 'home' | 'competitions' | 'favorites' | 'profile' | 'settings';

// CompetitionSummary for list views
export interface CompetitionSummary {
  id: string;
  name: string;
  date: string;
  location: string;
  club: string;
  description: string;
  discipline: Discipline;
  competitionType: CompetitionType;
  district: OrienteeringDistrict;
  latitude: number | null; // Updated to allow null
  longitude: number | null; // Updated to allow null
  isFavorite?: boolean;
  participantCount?: number; // Added to match Competition interface
  clubParticipantCount?: number; // Added to match Competition interface
}

// Competition class to match the backend C# model
export interface Competition {
  id: string;
  eventorId: string;
  name: string;
  date: string;
  location: string;
  club: string;
  description: string;
  discipline: Discipline;
  competitionType: CompetitionType;
  district: OrienteeringDistrict;
  branch: Branch;
  latitude: number | null; // Updated to allow null
  longitude: number | null; // Updated to allow null
  registrationDeadline: string | null; // Updated to allow null
  startTime: string | null; // Updated to allow null
  contact: string;
  eventorLink?: string | null; // Updated to allow null
  liveloxLink?: string | null; // Updated to allow null
  resources: Resource[];
  participantCount?: number; // Added property
  clubParticipantCount?: number; // Added property
}

// Resource interface matching backend C# model
export interface Resource {
  id: string;
  eventorId?: string;
  name: string;
  type: ResourceType;
  format: ResourceFormat;
  url: string;
  uploadDate: string;
}

// Add new interface for favorites
export interface UserFavorites {
  competitions: string[]; // Array of competition IDs
}
