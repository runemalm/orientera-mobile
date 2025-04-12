import { CompetitionSummary, Competition, ResourceType, ResourceFormat, Resource, Branch, CompetitionType, Discipline, OrienteeringDistrict } from "../types";

export const mockCompetitions: CompetitionSummary[] = [
  {
    id: "comp-1",
    name: "Ålems OK",
    date: "2025-04-06",
    location: "Ålem",
    distance: 4.3,
    club: "Ålems OK",
    description: "Nationell medeldistans i teknisk terräng med inslag av öppna områden.",
    discipline: Discipline.Middle, 
    competitionType: CompetitionType.National,
    district: OrienteeringDistrict.Smaland,
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
    discipline: Discipline.Long,
    competitionType: CompetitionType.National,
    district: OrienteeringDistrict.Smaland,
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
    discipline: Discipline.Long,
    competitionType: CompetitionType.Near,
    district: OrienteeringDistrict.Smaland,
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
    discipline: Discipline.Middle,
    competitionType: CompetitionType.Near,
    district: OrienteeringDistrict.Smaland,
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
    discipline: Discipline.Long,
    competitionType: CompetitionType.Near,
    district: OrienteeringDistrict.Smaland,
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
    discipline: Discipline.Long,
    competitionType: CompetitionType.Near,
    district: OrienteeringDistrict.Smaland,
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
    discipline: Discipline.Long,
    competitionType: CompetitionType.Near,
    district: OrienteeringDistrict.Smaland,
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
    discipline: Discipline.Long,
    competitionType: CompetitionType.Near,
    district: OrienteeringDistrict.Smaland,
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
    branch: Branch.FootO,
    resources: [
      {
        id: "file-1",
        eventorId: "doc-234",
        name: "Inbjudan.pdf",
        type: ResourceType.Invitation,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-03-01"
      },
      {
        id: "file-2",
        eventorId: "doc-235",
        name: "PM.pdf",
        type: ResourceType.PM,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-04-03"
      }
    ],
    registrationDeadline: "2025-04-02",
    startTime: "10:00",
    contact: "Anders Karlsson",
    eventorLink: "https://www.alemsok.se/vartavling2025",
    liveloxLink: "https://www.livelox.com/Events/Show/12345"
  },
  "comp-2": {
    ...mockCompetitions[1],
    eventorId: "109122",
    branch: Branch.FootO,
    resources: [
      {
        id: "file-3",
        eventorId: "doc-236",
        name: "Inbjudan.pdf",
        type: ResourceType.Invitation,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-03-15"
      },
      {
        id: "file-4",
        eventorId: "doc-237",
        name: "PM.pdf",
        type: ResourceType.PM,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-03-30"
      }
    ],
    registrationDeadline: "2025-03-29",
    startTime: "09:30",
    contact: "Eva Lindström",
    eventorLink: "https://www.sokviljan.se/veteranol2025",
    liveloxLink: "https://www.livelox.com/Events/Show/67890"
  },
  "comp-3": {
    ...mockCompetitions[2],
    eventorId: "109123",
    branch: Branch.FootO,
    resources: [
      {
        id: "file-5",
        eventorId: "doc-238",
        name: "Invitation.pdf",
        type: ResourceType.Invitation,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-04-01"
      }
    ],
    registrationDeadline: "2025-04-29",
    startTime: "09:00",
    contact: "Emma Roberts"
  },
  "comp-4": {
    ...mockCompetitions[3],
    eventorId: "109124",
    branch: Branch.FootO,
    resources: [
      {
        id: "file-14",
        eventorId: "doc-239",
        name: "Inbjudan.pdf",
        type: ResourceType.Invitation,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-03-20"
      },
      {
        id: "file-15",
        eventorId: "doc-240",
        name: "PM.pdf",
        type: ResourceType.PM,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-04-07"
      }
    ],
    registrationDeadline: "2025-04-07",
    startTime: "17:30",
    contact: "Maria Svensson",
    eventorLink: "https://www.lessebook.se/xxlungdom2025",
    liveloxLink: "https://www.livelox.com/Events/Show/54321"
  },
  "comp-5": {
    ...mockCompetitions[4],
    eventorId: "109125",
    branch: Branch.FootO,
    resources: [
      {
        id: "file-8",
        eventorId: "doc-241",
        name: "Invitation.pdf",
        type: ResourceType.Invitation,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-04-15"
      },
      {
        id: "file-9",
        eventorId: "doc-242",
        name: "PM.pdf",
        type: ResourceType.PM,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-05-10"
      },
      {
        id: "file-10",
        eventorId: "doc-243",
        name: "Start List.pdf",
        type: ResourceType.StartList,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Events/StartList?eventId=50210&groupBy=EventClass",
        uploadDate: "2025-05-14"
      }
    ],
    registrationDeadline: "2025-05-12",
    startTime: "12:00",
    contact: "Regional Committee",
    eventorLink: "https://regiono.org/relay2025"
  },
  "comp-6": {
    ...mockCompetitions[5],
    eventorId: "109126",
    branch: Branch.FootO,
    resources: [
      {
        id: "file-11",
        eventorId: "doc-244",
        name: "Inbjudan.pdf",
        type: ResourceType.Invitation,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-05-01"
      }
    ],
    registrationDeadline: "2025-05-20",
    startTime: "14:00",
    contact: "Lennart Svensson",
    eventorLink: "https://lessebook.se"
  },
  "comp-7": {
    ...mockCompetitions[6],
    eventorId: "109127",
    branch: Branch.FootO,
    resources: [
      {
        id: "file-12",
        eventorId: "doc-245",
        name: "Inbjudan.pdf",
        type: ResourceType.Invitation,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-05-10"
      },
      {
        id: "file-13",
        eventorId: "doc-246",
        name: "PM.pdf",
        type: ResourceType.PM,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-05-25"
      }
    ],
    registrationDeadline: "2025-05-28",
    startTime: "11:00",
    contact: "Karin Johansson",
    eventorLink: "https://torsasok.se"
  },
  "comp-8": {
    ...mockCompetitions[7],
    eventorId: "109128",
    branch: Branch.FootO,
    resources: [
      {
        id: "file-16",
        eventorId: "doc-247",
        name: "Inbjudan.pdf",
        type: ResourceType.Invitation,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/108121/0/Inbjudan",
        uploadDate: "2025-03-25"
      },
      {
        id: "file-17",
        eventorId: "doc-248",
        name: "PM.pdf",
        type: ResourceType.PM,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/110144/1/PM",
        uploadDate: "2025-04-14"
      }
    ],
    registrationDeadline: "2025-04-14",
    startTime: "10:00",
    contact: "Sven Pettersson",
    eventorLink: "https://www.torsasok.se/veteran2025",
    liveloxLink: "https://www.livelox.com/Events/Show/78901"
  },
};
