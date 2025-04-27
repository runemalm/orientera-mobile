
import { CompetitionSummary, Competition, ResourceType, ResourceFormat, Resource, Branch, CompetitionType, Discipline, OrienteeringDistrict } from "../types";

export const mockCompetitions: CompetitionSummary[] = [
  {
    id: "comp-1",
    name: "Ålems OK Medeldistans",
    date: "2025-04-16",
    location: "Ålem",
    club: "Ålems OK",
    description: "Nationell medeldistans i teknisk terräng med inslag av öppna områden.",
    discipline: Discipline.Middle, 
    competitionType: CompetitionType.National,
    district: OrienteeringDistrict.Smaland,
    branch: Branch.FootO,  // Added branch property
    latitude: 56.9258,
    longitude: 16.4332,
    participantCount: 125,
    clubParticipantCount: 18
  },
  {
    id: "comp-2",
    name: "Veteran-OL SOK Viljan",
    date: "2025-04-20",
    location: "Vimmerby",
    club: "SOK Viljan",
    description: "Nationell långdistans för veteraner i varierande skogsterräng.",
    discipline: Discipline.Long,
    competitionType: CompetitionType.National,
    district: OrienteeringDistrict.Smaland,
    branch: Branch.FootO,  // Added branch property
    latitude: 57.6655,
    longitude: 15.8568
  },
  {
    id: "comp-3",
    name: "Kalmar OK Långdistans",
    date: "2025-05-05",
    location: "Björkholmen",
    club: "Kalmar OK",
    description: "Utmanande långdistansorientering i kuperad terräng med tekniska inslag.",
    discipline: Discipline.Long,
    competitionType: CompetitionType.Near,
    district: OrienteeringDistrict.Smaland,
    branch: Branch.FootO,  // Added branch property
    latitude: 56.6633,
    longitude: 16.3569
  },
  {
    id: "comp-4",
    name: "Lessebo OK Ungdomsserie",
    date: "2025-04-25",
    location: "Lessebo",
    club: "Lessebo OK",
    description: "Medeldistans för ungdomar och motionärer i lättframkomlig terräng.",
    discipline: Discipline.Middle,
    competitionType: CompetitionType.Near,
    district: OrienteeringDistrict.Smaland,
    branch: Branch.FootO,  // Added branch property
    latitude: 56.7512,
    longitude: 15.2722
  },
  {
    id: "comp-5",
    name: "OK Orion Stafett",
    date: "2025-05-15",
    location: "Emmaboda",
    club: "OK Orion",
    description: "Lagstafett med tre sträckor av varierande svårighetsgrad.",
    discipline: Discipline.Relay,
    competitionType: CompetitionType.Near,
    district: OrienteeringDistrict.Smaland,
    branch: Branch.FootO,  // Added branch property
    latitude: 56.6313,
    longitude: 15.5359
  },
  {
    id: "comp-6",
    name: "Veteran-OL Lessebo",
    date: "2025-05-22",
    location: "Lessebo Skogsområde",
    club: "Lessebo OK",
    description: "Teknisk orientering i detaljrik terräng, perfekt för veteraner.",
    discipline: Discipline.Long,
    competitionType: CompetitionType.Near,
    district: OrienteeringDistrict.Smaland,
    branch: Branch.FootO,  // Added branch property
    latitude: 56.7512,
    longitude: 15.2722
  },
  {
    id: "comp-7",
    name: "Torsås OK Veteran",
    date: "2025-05-30",
    location: "Torsås",
    club: "Torsås OK",
    description: "Vänlig terräng med blandskog och öppna gläntor.",
    discipline: Discipline.Long,
    competitionType: CompetitionType.Near,
    district: OrienteeringDistrict.Smaland,
    branch: Branch.FootO,  // Added branch property
    latitude: 56.4108,
    longitude: 16.0030
  },
  {
    id: "comp-8",
    name: "Torsås OK Klassisk",
    date: "2025-04-28",
    location: "Torsås",
    club: "Torsås OK",
    description: "Långdistansorientering för veteraner i kuperad skogsterräng.",
    discipline: Discipline.Long,
    competitionType: CompetitionType.Near,
    district: OrienteeringDistrict.Smaland,
    branch: Branch.FootO,  // Added branch property
    latitude: 56.4108,
    longitude: 16.0030
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
      },
      {
        id: "file-3",
        eventorId: "doc-236",
        name: "Startlista.pdf",
        type: ResourceType.StartList,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/108121/2/Startlista",
        uploadDate: "2025-04-14"
      },
      {
        id: "file-4",
        eventorId: "doc-237",
        name: "Klubbstartlista.pdf",
        type: ResourceType.EntryList,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/108121/3/Klubbstartlista",
        uploadDate: "2025-04-14"
      }
    ],
    registrationDeadline: "2025-04-12",
    startTime: "10:00",
    contact: "Anders Karlsson",
    eventorLink: "https://eventor.orientering.se/Events/Show/108121",
    liveloxLink: "https://www.livelox.com/Events/Show/12345",
    participantCount: 125,
    clubParticipantCount: 18
  },
  "comp-2": {
    ...mockCompetitions[1],
    eventorId: "109122",
    branch: Branch.FootO,
    resources: [
      {
        id: "file-5",
        eventorId: "doc-238",
        name: "Inbjudan.pdf",
        type: ResourceType.Invitation,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/109122/0/Inbjudan",
        uploadDate: "2025-03-15"
      },
      {
        id: "file-6",
        eventorId: "doc-239",
        name: "PM.pdf",
        type: ResourceType.PM,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/109122/1/PM",
        uploadDate: "2025-03-30"
      },
      {
        id: "file-7",
        eventorId: "doc-240",
        name: "Resultat.pdf",
        type: ResourceType.Results,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/109122/4/Resultat",
        uploadDate: "2025-04-20"
      },
      {
        id: "file-8",
        eventorId: "doc-241",
        name: "Sträcktider.pdf",
        type: ResourceType.Splits,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/109122/5/Stracktider",
        uploadDate: "2025-04-20"
      }
    ],
    registrationDeadline: "2025-04-18",
    startTime: "09:30",
    contact: "Eva Lindström",
    eventorLink: "https://eventor.orientering.se/Events/Show/109122",
    liveloxLink: "https://www.livelox.com/Events/Show/67890",
    participantCount: 92,
    clubParticipantCount: 14
  },
  "comp-3": {
    ...mockCompetitions[2],
    eventorId: "109123",
    branch: Branch.FootO,
    resources: [
      {
        id: "file-9",
        eventorId: "doc-242",
        name: "Inbjudan.pdf",
        type: ResourceType.Invitation,
        format: ResourceFormat.Pdf,
        url: "https://eventor.orientering.se/Documents/Event/109123/0/Inbjudan",
        uploadDate: "2025-04-01"
      },
      {
        id: "file-10",
        eventorId: "doc-243",
        name: "Arenaskiss.png",
        type: ResourceType.Other,
        format: ResourceFormat.Png,
        url: "https://eventor.orientering.se/Documents/Event/109123/6/Arenaskiss",
        uploadDate: "2025-04-25"
      }
    ],
    registrationDeadline: "2025-05-02",
    startTime: "09:00",
    contact: "Emma Svensson",
    eventorLink: "https://eventor.orientering.se/Events/Show/109123",
    participantCount: 78,
    clubParticipantCount: 10
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
    liveloxLink: "https://www.livelox.com/Events/Show/54321",
    participantCount: 56,
    clubParticipantCount: 12
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
    eventorLink: "https://regiono.org/relay2025",
    participantCount: 45,
    clubParticipantCount: 15
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
    eventorLink: "https://lessebook.se",
    participantCount: 32,
    clubParticipantCount: 8
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
    eventorLink: "https://torsasok.se",
    participantCount: 28,
    clubParticipantCount: 6
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
    liveloxLink: "https://www.livelox.com/Events/Show/78901",
    participantCount: 40,
    clubParticipantCount: 9
  },
};
