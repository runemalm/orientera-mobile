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

// Updated to match the API spec's District enum
export enum OrienteeringDistrict {
  Blekinge = 'Blekinge',
  Bohuslan = 'Bohuslan',
  Dalarna = 'Dalarna',
  Gotland = 'Gotland',
  Gastrikland = 'Gastrikland',
  Goteborg = 'Goteborg',
  Halland = 'Halland',
  Halsingland = 'Halsingland',
  JamtlandHarjedalen = 'JamtlandHarjedalen',
  Medelpad = 'Medelpad',
  Norrbotten = 'Norrbotten',
  Skane = 'Skane',
  Smaland = 'Smaland',
  Stockholm = 'Stockholm',
  Sodermanland = 'Sodermanland',
  Uppland = 'Uppland',
  Varmland = 'Varmland',
  Vasterbotten = 'Vasterbotten',
  Vastergotland = 'Vastergotland',
  Vastmanland = 'Vastmanland',
  Angermanland = 'Angermanland',
  OrebroLan = 'OrebroLan',
  Ostergotland = 'Ostergotland'
}

// Add new enums from the API spec
export enum CompetitionOrderBy {
  Date = 'Date',
  Distance = 'Distance'
}

export enum OrderDirection {
  Ascending = 'Ascending',
  Descending = 'Descending'
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

// Update the TabName type to include 'assistant'
export type TabName = 'home' | 'competitions' | 'favorites' | 'profile' | 'settings' | 'assistant';

// Add the Filter interface that was missing
export interface Filter {
  useLocationFilter: boolean;
  maxDistanceKm: number;
  districts: string[];
  disciplines: string[];
  competitionTypes: string[];
  branches: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

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
  branch: Branch;
  latitude: number | null;
  longitude: number | null;
  isFavorite?: boolean;
  participantCount?: number;
  clubParticipantCount?: number;
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
  latitude: number | null;
  longitude: number | null;
  registrationDeadline: string | null;
  startTime: string | null;
  contact: string;
  eventorLink?: string | null;
  liveloxLink?: string | null;
  resources: Resource[];
  participantCount?: number;
  clubParticipantCount?: number;
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
  count?: number;
}

// Add new interface for favorites
export interface UserFavorites {
  competitions: string[]; // Array of competition IDs
}
