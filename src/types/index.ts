
export interface Competition {
  id: string;
  name: string;
  date: string;
  location: string;
  distance: number; // Distance in km from user's location
  club: string;
  description: string;
  disciplines: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface CompetitionDetail extends Competition {
  files: CompetitionFile[];
  registrationDeadline: string;
  startTime: string;
  organizer: string;
  contact: string;
  website?: string;
  isRegistered?: boolean;
}

export interface CompetitionFile {
  id: string;
  name: string;
  type: 'startlist' | 'results' | 'splits' | 'invitation' | 'pm' | 'other';
  url: string;
  uploadDate: string;
}

export type TabName = 'competitions' | 'profile';
