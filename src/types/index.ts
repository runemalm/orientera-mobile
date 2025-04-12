
export type CompetitionType = "Championship" | "National" | "Regional" | "Near" | "Club" | "Weekly";

export type CompetitionDiscipline = "Sprint" | "Middle" | "Long" | "Night" | "Relay" | "UltraLong" | "PreO" | "TempO";

export type Branch = "FootO" | "PreO" | "MTBO" | "SkiO" | "TrailO";

export type OrienteeringDistrict = 
  "BlekingeOF" | "BohuslänsOF" | "DalarnasOF" | "GotlandsOF" | 
  "GästriklandsOF" | "GöteborgsOF" | "HallandsOF" | "HälsinglandsOF" | 
  "JämtlandHärjedalensOF" | "MedelpadsOF" | "NorrbottensOF" | "SkånesOF" | 
  "SmålandsOF" | "StockholmsOF" | "SödermanlandsOF" | "UpplandsOF" | 
  "VärmlandsOF" | "VästerbottensOF" | "VästergötlandsOF" | "VästmanlandsOF" | 
  "ÅngermanlandsOF" | "ÖrebroLänsOF" | "ÖstergötlandsOF";

export interface Competition {
  id: string;
  eventorId: string;
  name: string;
  date: string;
  location: string;
  distance?: number; // Distance in km from user's location, calculated client-side
  club: string;
  description: string;
  branch: Branch;
  discipline: CompetitionDiscipline;
  competitionType: CompetitionType;
  district: OrienteeringDistrict;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface CompetitionDetail extends Competition {
  resources: CompetitionResource[];
  registrationDeadline?: string;
  startTime?: string;
  contact: string;
  eventorLink?: string;
  liveloxLink?: string;
  isRegistered?: boolean;
  isWaitlisted?: boolean;
}

export interface CompetitionResource {
  eventorId: string;
  name: string;
  type: 'startlist' | 'results' | 'splits' | 'invitation' | 'pm' | 'other';
  format: 'pdf' | 'png' | 'link';
  url: string;
  uploadDate: string;
}

export type TabName = 'competitions' | 'info';
