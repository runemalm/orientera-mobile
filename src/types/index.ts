
export enum ResourceFormat {
  Link = 'Link',
  Pdf = 'Pdf',
  Png = 'Png',
  Jpeg = 'Jpeg',
  Gif = 'Gif',
  Other = 'Other'
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

export enum Branch {
  FootO = 'FootO',
  SkiO = 'SkiO',
  MTBO = 'MTBO',
  TrailO = 'TrailO',
  Other = 'Other'
}

export enum CompetitionType {
  World = 'World',
  International = 'International',
  Championship = 'Championship',
  National = 'National',
  District = 'District',
  Near = 'Near'
}

export enum Discipline {
  Sprint = 'Sprint',
  Middle = 'Middle',
  Long = 'Long',
  UltraLong = 'UltraLong',
  Relay = 'Relay',
  Night = 'Night',
  Other = 'Other'
}

export enum OrienteeringDistrict {
  Blekinge = 'Blekinge',
  Bohuslan = 'Bohuslan',
  Dalarna = 'Dalarna',
  Gotland = 'Gotland',
  Gavleborg = 'Gavleborg',
  Halland = 'Halland',
  Halsingland = 'Halsingland',
  Jamtland = 'Jamtland',
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
  Orebro = 'Orebro',
  Ostergotland = 'Ostergotland'
}

export type TabName = 'home' | 'competitions' | 'favorites' | 'profile';

export interface Resource {
  id: string;
  eventorId?: string;
  name: string;
  type: ResourceType;
  format: ResourceFormat;
  url: string;
  uploadDate: string;
}

export interface CompetitionSummary {
  id: string;
  name: string;
  date: string;
  location: string;
  club: string;
  description?: string;
  discipline: Discipline;
  competitionType: CompetitionType;
  district: OrienteeringDistrict;
  latitude?: number;
  longitude?: number;
  participantCount?: number;
  clubParticipantCount?: number;
}

export interface Competition extends CompetitionSummary {
  eventorId?: string;
  branch: Branch;
  resources: Resource[];
  registrationDeadline?: string;
  startTime?: string;
  contact?: string;
  eventorLink?: string;
  liveloxLink?: string;
}
