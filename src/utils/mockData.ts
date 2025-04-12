
import { Competition, CompetitionDetail, CompetitionType, CompetitionDiscipline, OrienteeringDistrict, CompetitionResource } from "../types";

export const mockCompetitions: Competition[] = [
  {
    id: "comp-1",
    eventorId: "evt-1",
    name: "Ålems OK",
    date: "2025-04-06",
    location: "Ålem",
    distance: 4.3,
    club: "Ålems OK",
    description: "Nationell medeldistans i teknisk terräng med inslag av öppna områden.",
    branch: "FootO",
    discipline: "Middle",
    competitionType: "National",
    district: "SmålandsOF",
    coordinates: {
      latitude: 56.9258,
      longitude: 16.4332
    }
  },
  {
    id: "comp-2",
    eventorId: "evt-2",
    name: "Veteran-OL, SOK Viljan",
    date: "2025-04-02",
    location: "Vimmerby",
    distance: 3.8,
    club: "SOK Viljan",
    description: "Nationell långdistans för veteraner i varierande skogsterräng.",
    branch: "FootO",
    discipline: "Long",
    competitionType: "National",
    district: "SmålandsOF",
    coordinates: {
      latitude: 57.6655,
      longitude: 15.8568
    }
  },
  {
    id: "comp-3",
    eventorId: "evt-3",
    name: "Veteran-OL",
    date: "2025-05-02",
    location: "Björkholmen",
    distance: 5.6,
    club: "Målilla OK",
    description: "Utmanande långdistansorientering i kuperad terräng med tekniska inslag.",
    branch: "FootO",
    discipline: "Long",
    competitionType: "Near",
    district: "SmålandsOF",
    coordinates: {
      latitude: 59.3349,
      longitude: 18.0603
    }
  },
  {
    id: "comp-4",
    eventorId: "evt-4",
    name: "XXL Ungdomsserie och Motionsorientering",
    date: "2025-04-09",
    location: "Lessebo",
    distance: 2.7,
    club: "Lessebo OK",
    description: "Medeldistans för ungdomar och motionärer i lättframkomlig terräng.",
    branch: "FootO",
    discipline: "Middle",
    competitionType: "Near",
    district: "SmålandsOF",
    coordinates: {
      latitude: 56.7512,
      longitude: 15.2722
    }
  },
  {
    id: "comp-5",
    eventorId: "evt-5",
    name: "Veteran-OL",
    date: "2025-05-15",
    location: "Emmabodaskogen",
    distance: 1.8,
    club: "OK Orion",
    description: "Lagstafett med tre sträckor av varierande svårighetsgrad.",
    branch: "FootO",
    discipline: "Long",
    competitionType: "Near",
    district: "SmålandsOF",
    coordinates: {
      latitude: 59.3400,
      longitude: 18.0700
    }
  },
  {
    id: "comp-6",
    eventorId: "evt-6",
    name: "Veteran-OL",
    date: "2025-05-22",
    location: "Lessebo Skogsområde",
    distance: 3.2,
    club: "Lessebo OK",
    description: "Teknisk orientering i detaljrik terräng, perfekt för veteraner.",
    branch: "FootO",
    discipline: "Long",
    competitionType: "Near",
    district: "SmålandsOF",
    coordinates: {
      latitude: 56.7512,
      longitude: 15.2722
    }
  },
  {
    id: "comp-7",
    eventorId: "evt-7",
    name: "Veteran-OL",
    date: "2025-05-30",
    location: "Torsås Skogsmarker",
    distance: 2.9,
    club: "Torsås OK",
    description: "Vänlig terräng med blandskog och öppna gläntor.",
    branch: "FootO",
    discipline: "Long",
    competitionType: "Near",
    district: "SmålandsOF",
    coordinates: {
      latitude: 56.4108,
      longitude: 16.0030
    }
  },
  {
    id: "comp-8",
    eventorId: "evt-8",
    name: "Veteran-OL Torsås OK",
    date: "2025-04-16",
    location: "Torsås",
    distance: 3.4,
    club: "Torsås OK",
    description: "Långdistansorientering för veteraner i kuperad skogsterräng.",
    branch: "FootO",
    discipline: "Long",
    competitionType: "Near",
    district: "SmålandsOF",
    coordinates: {
      latitude: 56.4108,
      longitude: 16.0030
    }
  },
];

export const mockCompetitionDetails: Record<string, CompetitionDetail> = {
  "comp-1": {
    ...mockCompetitions[0],
    resources: [
      {
        eventorId: "file-1",
        name: "Inbjudan.pdf",
        type: "invitation",
        format: "pdf",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-03-01"
      },
      {
        eventorId: "file-2",
        name: "PM.pdf",
        type: "pm",
        format: "pdf",
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-04-03"
      }
    ],
    registrationDeadline: "2025-04-02",
    startTime: "10:00",
    contact: "info@alemsok.se",
    eventorLink: "https://eventor.orientering.se/Events/Show/123",
    liveloxLink: "https://www.livelox.com/Events/Show/12345",
    isRegistered: false
  },
  "comp-2": {
    ...mockCompetitions[1],
    resources: [
      {
        eventorId: "file-3",
        name: "Inbjudan.pdf",
        type: "invitation",
        format: "pdf",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-03-15"
      },
      {
        eventorId: "file-4",
        name: "PM.pdf",
        type: "pm",
        format: "pdf",
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-03-30"
      }
    ],
    registrationDeadline: "2025-03-29",
    startTime: "09:30",
    contact: "info@sokviljan.se",
    eventorLink: "https://eventor.orientering.se/Events/Show/456",
    liveloxLink: "https://www.livelox.com/Events/Show/67890",
    isRegistered: false
  },
  "comp-3": {
    ...mockCompetitions[2],
    resources: [
      {
        eventorId: "file-5",
        name: "Invitation.pdf",
        type: "invitation",
        format: "pdf",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-04-01"
      }
    ],
    registrationDeadline: "2025-04-29",
    startTime: "09:00",
    contact: "eroberts@mountainexplorers.com",
    isRegistered: true
  },
  "comp-4": {
    ...mockCompetitions[3],
    resources: [
      {
        eventorId: "file-14",
        name: "Inbjudan.pdf",
        type: "invitation",
        format: "pdf",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-03-20"
      },
      {
        eventorId: "file-15",
        name: "PM.pdf",
        type: "pm",
        format: "pdf",
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-04-07"
      }
    ],
    registrationDeadline: "2025-04-07",
    startTime: "17:30",
    contact: "info@lessebook.se",
    eventorLink: "https://eventor.orientering.se/Events/Show/789",
    liveloxLink: "https://www.livelox.com/Events/Show/54321",
    isRegistered: false
  },
  "comp-5": {
    ...mockCompetitions[4],
    resources: [
      {
        eventorId: "file-8",
        name: "Invitation.pdf",
        type: "invitation",
        format: "pdf",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-04-15"
      },
      {
        eventorId: "file-9",
        name: "PM.pdf",
        type: "pm",
        format: "pdf",
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-05-10"
      },
      {
        eventorId: "file-10",
        name: "Start List.pdf",
        type: "startlist",
        format: "pdf",
        url: "https://eventor.orientering.se/Events/StartList?eventId=50210&groupBy=EventClass",
        uploadDate: "2025-05-14"
      }
    ],
    registrationDeadline: "2025-05-12",
    startTime: "12:00",
    contact: "info@regiono.org",
    eventorLink: "https://eventor.orientering.se/Events/Show/987",
    isRegistered: false
  },
  "comp-6": {
    ...mockCompetitions[5],
    resources: [
      {
        eventorId: "file-11",
        name: "Inbjudan.pdf",
        type: "invitation",
        format: "pdf",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-05-01"
      }
    ],
    registrationDeadline: "2025-05-20",
    startTime: "14:00",
    contact: "lennart@lessebook.se",
    eventorLink: "https://eventor.orientering.se/Events/Show/654",
    isRegistered: false
  },
  "comp-7": {
    ...mockCompetitions[6],
    resources: [
      {
        eventorId: "file-12",
        name: "Inbjudan.pdf",
        type: "invitation",
        format: "pdf",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-05-10"
      },
      {
        eventorId: "file-13",
        name: "PM.pdf",
        type: "pm",
        format: "pdf",
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-05-25"
      }
    ],
    registrationDeadline: "2025-05-28",
    startTime: "11:00",
    contact: "karin@torsasok.se",
    eventorLink: "https://eventor.orientering.se/Events/Show/321",
    isRegistered: false
  },
  "comp-8": {
    ...mockCompetitions[7],
    resources: [
      {
        eventorId: "file-16",
        name: "Inbjudan.pdf",
        type: "invitation",
        format: "pdf",
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-03-25"
      },
      {
        eventorId: "file-17",
        name: "PM.pdf",
        type: "pm",
        format: "pdf",
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-04-14"
      }
    ],
    registrationDeadline: "2025-04-14",
    startTime: "10:00",
    contact: "info@torsasok.se",
    eventorLink: "https://eventor.orientering.se/Events/Show/135",
    liveloxLink: "https://www.livelox.com/Events/Show/78901",
    isRegistered: false
  },
};
