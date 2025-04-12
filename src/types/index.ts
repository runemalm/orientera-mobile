
export type CompetitionType = "Värdetävling" | "Nationell tävling" | "Distrikttävling" | "Närtävling" | "Veckans bana" | "Klubbtävling";

export type CompetitionDiscipline = "Sprint" | "Medel" | "Lång" | "Natt" | "Stafett" | "Ultralång";

export type OrienteeringDistrict = 
  "Blekinge OF" | "Bohusläns OF" | "Dalarnas OF" | "Gotlands OF" | 
  "Gästriklands OF" | "Göteborgs OF" | "Hallands OF" | "Hälsinglands OF" | 
  "Jämtland-Härjedalens OF" | "Medelpads OF" | "Norrbottens OF" | "Skånes OF" | 
  "Smålands OF" | "Stockholms OF" | "Södermanlands OF" | "Upplands OF" | 
  "Värmlands OF" | "Västerbottens OF" | "Västergötlands OF" | "Västmanlands OF" | 
  "Ångermanlands OF" | "Örebro Läns OF" | "Östergötlands OF";

// Renamed Competition to CompetitionSummary
export interface CompetitionSummary {
  id: string;
  name: string;
  date: string;
  location: string;
  distance: number; // Distance in km from user's location
  club: string;
  description: string;
  discipline: CompetitionDiscipline; // Changed from disciplines array to single discipline
  competitionType: CompetitionType;
  district: OrienteeringDistrict;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Renamed CompetitionDetail to Competition
export interface Competition extends CompetitionSummary {
  resources: Resource[]; // Renamed from files
  registrationDeadline: string;
  startTime: string;
  organizer: string;
  contact: string;
  website?: string;
  liveloxLink?: string; 
  isRegistered?: boolean;
  isWaitlisted?: boolean;
}

// Renamed CompetitionFile to Resource
export interface Resource {
  id: string;
  name: string;
  type: 'startlist' | 'results' | 'splits' | 'invitation' | 'pm' | 'other';
  url: string;
  uploadDate: string;
}

export type TabName = 'competitions' | 'info';
