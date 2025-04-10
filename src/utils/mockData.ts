
import { Competition, CompetitionDetail } from "../types";

export const mockCompetitions: Competition[] = [
  {
    id: "comp-1",
    name: "Spring Forest Run",
    date: "2025-04-20",
    location: "Northside Forest Park",
    distance: 2.4,
    club: "Northside Orienteers",
    description: "Mid-distance orienteering in varied forest terrain with good runnability.",
    disciplines: ["middle-distance"],
    coordinates: {
      latitude: 59.3293,
      longitude: 18.0686
    }
  },
  {
    id: "comp-2",
    name: "City Sprint Challenge",
    date: "2025-04-25",
    location: "Downtown Eastside",
    distance: 3.8,
    club: "Urban Navigators",
    description: "Fast-paced sprint orienteering through urban environment with complex route choices.",
    disciplines: ["sprint"],
    coordinates: {
      latitude: 59.3325,
      longitude: 18.0649
    }
  },
  {
    id: "comp-3",
    name: "Highland Long Distance",
    date: "2025-05-02",
    location: "Highland National Park",
    distance: 5.6,
    club: "Mountain Explorers",
    description: "Challenging long-distance event in hilly terrain with technical sections.",
    disciplines: ["long-distance"],
    coordinates: {
      latitude: 59.3349,
      longitude: 18.0603
    }
  },
  {
    id: "comp-4",
    name: "Night Owl Challenge",
    date: "2025-05-10",
    location: "Westwood Forest",
    distance: 4.2,
    club: "Night Runners Club",
    description: "Exciting night orienteering with headlamps required. Technical forest navigation.",
    disciplines: ["night", "middle-distance"],
    coordinates: {
      latitude: 59.3219,
      longitude: 18.0720
    }
  },
  {
    id: "comp-5",
    name: "Relay Championships",
    date: "2025-05-15",
    location: "Eastside Community Park",
    distance: 1.8,
    club: "Regional Orienteering Association",
    description: "Team relay competition with three legs of varying difficulty.",
    disciplines: ["relay"],
    coordinates: {
      latitude: 59.3400,
      longitude: 18.0700
    }
  }
];

export const mockCompetitionDetails: Record<string, CompetitionDetail> = {
  "comp-1": {
    ...mockCompetitions[0],
    files: [
      {
        id: "file-1",
        name: "Invitation.pdf",
        type: "invitation",
        url: "#",
        uploadDate: "2025-03-15"
      },
      {
        id: "file-2",
        name: "PM.pdf",
        type: "pm",
        url: "#",
        uploadDate: "2025-04-10"
      }
    ],
    registrationDeadline: "2025-04-15",
    startTime: "10:00",
    organizer: "Sarah Johnson",
    contact: "sarahjohnson@northsideorienteers.com",
    website: "https://northsideorienteers.com",
    isRegistered: false
  },
  "comp-2": {
    ...mockCompetitions[1],
    files: [
      {
        id: "file-3",
        name: "Invitation.pdf",
        type: "invitation",
        url: "#",
        uploadDate: "2025-04-01"
      },
      {
        id: "file-4",
        name: "PM.pdf",
        type: "pm",
        url: "#",
        uploadDate: "2025-04-20"
      }
    ],
    registrationDeadline: "2025-04-22",
    startTime: "13:00",
    organizer: "Marcus Chen",
    contact: "mchen@urbannavigators.org",
    website: "https://urbannavigators.org",
    isRegistered: false
  },
  "comp-3": {
    ...mockCompetitions[2],
    files: [
      {
        id: "file-5",
        name: "Invitation.pdf",
        type: "invitation",
        url: "#",
        uploadDate: "2025-04-01"
      }
    ],
    registrationDeadline: "2025-04-29",
    startTime: "09:00",
    organizer: "Emma Roberts",
    contact: "eroberts@mountainexplorers.com",
    isRegistered: true
  },
  "comp-4": {
    ...mockCompetitions[3],
    files: [
      {
        id: "file-6",
        name: "Invitation.pdf",
        type: "invitation",
        url: "#",
        uploadDate: "2025-04-10"
      },
      {
        id: "file-7",
        name: "PM.pdf",
        type: "pm",
        url: "#",
        uploadDate: "2025-05-05"
      }
    ],
    registrationDeadline: "2025-05-08",
    startTime: "21:00",
    organizer: "Thomas White",
    contact: "twhite@nightrunners.com",
    website: "https://nightrunners.com",
    isRegistered: false
  },
  "comp-5": {
    ...mockCompetitions[4],
    files: [
      {
        id: "file-8",
        name: "Invitation.pdf",
        type: "invitation",
        url: "#",
        uploadDate: "2025-04-15"
      },
      {
        id: "file-9",
        name: "PM.pdf",
        type: "pm",
        url: "#",
        uploadDate: "2025-05-10"
      },
      {
        id: "file-10",
        name: "Start List.pdf",
        type: "startlist",
        url: "#",
        uploadDate: "2025-05-14"
      }
    ],
    registrationDeadline: "2025-05-12",
    startTime: "12:00",
    organizer: "Regional Committee",
    contact: "info@regiono.org",
    website: "https://regiono.org/relay2025",
    isRegistered: false
  }
};
