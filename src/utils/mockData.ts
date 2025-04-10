
import { Competition, CompetitionDetail, CompetitionType, CompetitionDiscipline, OrienteeringDistrict } from "../types";

export const mockCompetitions: Competition[] = [
  // Keeping only competitions from Smålands OF or Blekinge OF
  {
    id: "comp-3",
    name: "Veteran-OL",
    date: "2025-05-02",
    location: "Björkholmen",
    distance: 5.6,
    club: "Målilla OK",
    description: "Utmanande långdistansorientering i kuperad terräng med tekniska inslag.",
    disciplines: ["Lång"],
    competitionType: "Närtävling",
    district: "Smålands OF",
    coordinates: {
      latitude: 59.3349,
      longitude: 18.0603
    }
  },
  {
    id: "comp-5",
    name: "Veteran-OL",
    date: "2025-05-15",
    location: "Emmabodaskogen",
    distance: 1.8,
    club: "OK Orion",
    description: "Lagstafett med tre sträckor av varierande svårighetsgrad.",
    disciplines: ["Lång", "Stafett"],
    competitionType: "Närtävling",
    district: "Smålands OF",
    coordinates: {
      latitude: 59.3400,
      longitude: 18.0700
    }
  },
  {
    id: "comp-6",
    name: "Veteran-OL",
    date: "2025-05-22",
    location: "Lessebo Skogsområde",
    distance: 3.2,
    club: "Lessebo OK",
    description: "Teknisk orientering i detaljrik terräng, perfekt för veteraner.",
    disciplines: ["Lång", "Medel"],
    competitionType: "Närtävling",
    district: "Smålands OF",
    coordinates: {
      latitude: 56.7512,
      longitude: 15.2722
    }
  },
  {
    id: "comp-7",
    name: "Veteran-OL",
    date: "2025-05-30",
    location: "Torsås Skogsmarker",
    distance: 2.9,
    club: "Torsås OK",
    description: "Vänlig terräng med blandskog och öppna gläntor.",
    disciplines: ["Lång", "Sprint"],
    competitionType: "Närtävling",
    district: "Smålands OF",
    coordinates: {
      latitude: 56.4108,
      longitude: 16.0030
    }
  }
];

export const mockCompetitionDetails: Record<string, CompetitionDetail> = {
  // Keeping only details for competitions from Smålands OF or Blekinge OF
  "comp-3": {
    ...mockCompetitions[0],
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
  "comp-5": {
    ...mockCompetitions[1],
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
  },
  "comp-6": {
    ...mockCompetitions[2],
    files: [
      {
        id: "file-11",
        name: "Inbjudan.pdf",
        type: "invitation",
        url: "#",
        uploadDate: "2025-05-01"
      }
    ],
    registrationDeadline: "2025-05-20",
    startTime: "14:00",
    organizer: "Lennart Svensson",
    contact: "lennart@lessebook.se",
    website: "https://lessebook.se",
    isRegistered: false
  },
  "comp-7": {
    ...mockCompetitions[3],
    files: [
      {
        id: "file-12",
        name: "Inbjudan.pdf",
        type: "invitation",
        url: "#",
        uploadDate: "2025-05-10"
      },
      {
        id: "file-13",
        name: "PM.pdf",
        type: "pm",
        url: "#",
        uploadDate: "2025-05-25"
      }
    ],
    registrationDeadline: "2025-05-28",
    startTime: "11:00",
    organizer: "Karin Johansson",
    contact: "karin@torsasok.se",
    website: "https://torsasok.se",
    isRegistered: false
  }
};
