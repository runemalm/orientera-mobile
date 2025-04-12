
import { CompetitionSummary, Competition, CompetitionType, CompetitionDiscipline, OrienteeringDistrict, Resource } from "../types";

export const mockCompetitions: CompetitionSummary[] = [
  {
    id: "comp-1",
    name: "Ålems OK",
    date: "2025-04-06",
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
  {
    id: "comp-2",
    name: "Veteran-OL, SOK Viljan",
    date: "2025-04-02",
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
  {
    id: "comp-3",
    name: "Veteran-OL",
    date: "2025-05-02",
    location: "Björkholmen",
    distance: 5.6,
    club: "Målilla OK",
    description: "Utmanande långdistansorientering i kuperad terräng med tekniska inslag.",
    discipline: "Lång",
    competitionType: "Närtävling",
    district: "Smålands OF",
    coordinates: {
      latitude: 59.3349,
      longitude: 18.0603
    }
  },
  {
    id: "comp-4",
    name: "XXL Ungdomsserie och Motionsorientering",
    date: "2025-04-09",
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
    discipline: "Lång",
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
    discipline: "Lång",
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
    discipline: "Lång",
    competitionType: "Närtävling",
    district: "Smålands OF",
    coordinates: {
      latitude: 56.4108,
      longitude: 16.0030
    }
  },
  {
    id: "comp-8",
    name: "Veteran-OL Torsås OK",
    date: "2025-04-16",
    location: "Torsås",
    distance: 3.4,
    club: "Torsås OK",
    description: "Långdistansorientering för veteraner i kuperad skogsterräng.",
    discipline: "Lång",
    competitionType: "Närtävling",
    district: "Smålands OF",
    coordinates: {
      latitude: 56.4108,
      longitude: 16.0030
    }
  },
];

export const mockCompetitionDetails: Record<string, Competition> = {
  "comp-1": {
    ...mockCompetitions[0],
    eventorId: "108121",
    branch: "FootO",
    resources: [
      {
        id: "file-1",
        name: "Inbjudan.pdf",
        type: "invitation",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-03-01"
      },
      {
        id: "file-2",
        name: "PM.pdf",
        type: "pm",
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-04-03"
      }
    ],
    registrationDeadline: "2025-04-02",
    startTime: "10:00",
    contact: "Anders Karlsson",
    website: "https://www.alemsok.se/vartavling2025",
    liveloxLink: "https://www.livelox.com/Events/Show/12345",
    isRegistered: false
  },
  "comp-2": {
    ...mockCompetitions[1],
    eventorId: "109122",
    branch: "FootO",
    resources: [
      {
        id: "file-3",
        name: "Inbjudan.pdf",
        type: "invitation",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-03-15"
      },
      {
        id: "file-4",
        name: "PM.pdf",
        type: "pm",
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-03-30"
      }
    ],
    registrationDeadline: "2025-03-29",
    startTime: "09:30",
    contact: "Eva Lindström",
    website: "https://www.sokviljan.se/veteranol2025",
    liveloxLink: "https://www.livelox.com/Events/Show/67890",
    isRegistered: false
  },
  "comp-3": {
    ...mockCompetitions[2],
    eventorId: "109123",
    branch: "FootO",
    resources: [
      {
        id: "file-5",
        name: "Invitation.pdf",
        type: "invitation",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-04-01"
      }
    ],
    registrationDeadline: "2025-04-29",
    startTime: "09:00",
    contact: "Emma Roberts",
    isRegistered: true
  },
  "comp-4": {
    ...mockCompetitions[3],
    eventorId: "109124",
    branch: "FootO",
    resources: [
      {
        id: "file-14",
        name: "Inbjudan.pdf",
        type: "invitation",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-03-20"
      },
      {
        id: "file-15",
        name: "PM.pdf",
        type: "pm",
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-04-07"
      }
    ],
    registrationDeadline: "2025-04-07",
    startTime: "17:30",
    contact: "Maria Svensson",
    website: "https://www.lessebook.se/xxlungdom2025",
    liveloxLink: "https://www.livelox.com/Events/Show/54321",
    isRegistered: false
  },
  "comp-5": {
    ...mockCompetitions[4],
    eventorId: "109125",
    branch: "FootO",
    resources: [
      {
        id: "file-8",
        name: "Invitation.pdf",
        type: "invitation",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-04-15"
      },
      {
        id: "file-9",
        name: "PM.pdf",
        type: "pm",
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-05-10"
      },
      {
        id: "file-10",
        name: "Start List.pdf",
        type: "startlist",
        url: "https://eventor.orientering.se/Events/StartList?eventId=50210&groupBy=EventClass",
        uploadDate: "2025-05-14"
      }
    ],
    registrationDeadline: "2025-05-12",
    startTime: "12:00",
    contact: "Regional Committee",
    website: "https://regiono.org/relay2025",
    isRegistered: false
  },
  "comp-6": {
    ...mockCompetitions[5],
    eventorId: "109126",
    branch: "FootO",
    resources: [
      {
        id: "file-11",
        name: "Inbjudan.pdf",
        type: "invitation",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-05-01"
      }
    ],
    registrationDeadline: "2025-05-20",
    startTime: "14:00",
    contact: "Lennart Svensson",
    website: "https://lessebook.se",
    isRegistered: false
  },
  "comp-7": {
    ...mockCompetitions[6],
    eventorId: "109127",
    branch: "FootO",
    resources: [
      {
        id: "file-12",
        name: "Inbjudan.pdf",
        type: "invitation",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-05-10"
      },
      {
        id: "file-13",
        name: "PM.pdf",
        type: "pm",
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-05-25"
      }
    ],
    registrationDeadline: "2025-05-28",
    startTime: "11:00",
    contact: "Karin Johansson",
    website: "https://torsasok.se",
    isRegistered: false
  },
  "comp-8": {
    ...mockCompetitions[7],
    eventorId: "109128",
    branch: "FootO",
    resources: [
      {
        id: "file-16",
        name: "Inbjudan.pdf",
        type: "invitation",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-03-25"
      },
      {
        id: "file-17",
        name: "PM.pdf",
        type: "pm",
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-04-14"
      }
    ],
    registrationDeadline: "2025-04-14",
    startTime: "10:00",
    contact: "Sven Pettersson",
    website: "https://www.torsasok.se/veteran2025",
    liveloxLink: "https://www.livelox.com/Events/Show/78901",
    isRegistered: false
  },
};
