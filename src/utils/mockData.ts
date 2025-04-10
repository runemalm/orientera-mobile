import { Competition, CompetitionDetail, CompetitionType, CompetitionDiscipline, OrienteeringDistrict } from "../types";

export const mockCompetitions: Competition[] = [
  // Added new competition for Ålems OK
  {
    id: "comp-1",
    name: "Ålems OK",
    date: "2025-04-06", // April 6, 2025
    location: "Ålem",
    distance: 4.3,
    club: "Ålems OK",
    description: "Nationell medeldistans i teknisk terräng med inslag av öppna områden.",
    discipline: "Medel", 
    competitionType: "Nationell tävling",
    district: "Smålands OF",
    coordinates: {
      latitude: 56.9258,
      longitude: 16.4332
    }
  },
  // Added new competition for SOK Viljan
  {
    id: "comp-2",
    name: "Veteran-OL, SOK Viljan",
    date: "2025-04-02", // April 2, 2025
    location: "Vimmerby",
    distance: 3.8,
    club: "SOK Viljan",
    description: "Nationell långdistans för veteraner i varierande skogsterräng.",
    discipline: "Lång",
    competitionType: "Nationell tävling",
    district: "Smålands OF",
    coordinates: {
      latitude: 57.6655,
      longitude: 15.8568
    }
  },
  // Keeping only competitions from Smålands OF or Blekinge OF
  {
    id: "comp-3",
    name: "Veteran-OL",
    date: "2025-05-02",
    location: "Björkholmen",
    distance: 5.6,
    club: "Målilla OK",
    description: "Utmanande långdistansorientering i kuperad terräng med tekniska inslag.",
    discipline: "Lång", // Changed to single discipline
    competitionType: "Närtävling",
    district: "Smålands OF",
    coordinates: {
      latitude: 59.3349,
      longitude: 18.0603
    }
  },
  // Added new competition for XXL Ungdomsserie och Motionsorientering
  {
    id: "comp-4",
    name: "XXL Ungdomsserie och Motionsorientering",
    date: "2025-04-09", // April 9, 2025
    location: "Lessebo",
    distance: 2.7,
    club: "Lessebo OK",
    description: "Medeldistans för ungdomar och motionärer i lättframkomlig terräng.",
    discipline: "Medel",
    competitionType: "Närtävling",
    district: "Smålands OF",
    coordinates: {
      latitude: 56.7512,
      longitude: 15.2722
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
    discipline: "Lång", // Changed to single discipline
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
    discipline: "Lång", // Changed to single discipline
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
    discipline: "Lång", // Changed to single discipline
    competitionType: "Närtävling",
    district: "Smålands OF",
    coordinates: {
      latitude: 56.4108,
      longitude: 16.0030
    }
  }
];

export const mockCompetitionDetails: Record<string, CompetitionDetail> = {
  // Added new competition detail for Ålems OK
  "comp-1": {
    ...mockCompetitions[0],
    files: [
      {
        id: "file-1",
        name: "Inbjudan.pdf",
        type: "invitation",
        url: "#",
        uploadDate: "2025-03-01"
      },
      {
        id: "file-2",
        name: "PM.pdf",
        type: "pm",
        url: "#",
        uploadDate: "2025-04-03"
      }
    ],
    registrationDeadline: "2025-04-02",
    startTime: "10:00",
    organizer: "Anders Karlsson",
    contact: "info@alemsok.se",
    website: "https://www.alemsok.se/vartavling2025",
    liveloxLink: "https://www.livelox.com/Events/Show/12345", // Added Livelox link
    isRegistered: false
  },
  // Added new competition detail for SOK Viljan
  "comp-2": {
    ...mockCompetitions[1],
    files: [
      {
        id: "file-3",
        name: "Inbjudan.pdf",
        type: "invitation",
        url: "#",
        uploadDate: "2025-03-15"
      },
      {
        id: "file-4",
        name: "PM.pdf",
        type: "pm",
        url: "#",
        uploadDate: "2025-03-30"
      }
    ],
    registrationDeadline: "2025-03-29",
    startTime: "09:30",
    organizer: "Eva Lindström",
    contact: "info@sokviljan.se",
    website: "https://www.sokviljan.se/veteranol2025",
    liveloxLink: "https://www.livelox.com/Events/Show/67890", // Added Livelox link
    isRegistered: false
  },
  // Keeping only details for competitions from Smålands OF or Blekinge OF
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
  // Added new competition detail for XXL Ungdomsserie och Motionsorientering
  "comp-4": {
    ...mockCompetitions[3],
    files: [
      {
        id: "file-14",
        name: "Inbjudan.pdf",
        type: "invitation",
        url: "#",
        uploadDate: "2025-03-20"
      },
      {
        id: "file-15",
        name: "PM.pdf",
        type: "pm",
        url: "#",
        uploadDate: "2025-04-07"
      }
    ],
    registrationDeadline: "2025-04-07",
    startTime: "17:30",
    organizer: "Maria Svensson",
    contact: "info@lessebook.se",
    website: "https://www.lessebook.se/xxlungdom2025",
    liveloxLink: "https://www.livelox.com/Events/Show/54321", // Added Livelox link
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
  },
  "comp-6": {
    ...mockCompetitions[5],
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
    ...mockCompetitions[6],
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
