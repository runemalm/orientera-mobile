
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { Competition } from '../types';
import { mockCompetitionDetails } from '../utils/mockData';

// Define interfaces for our data
interface Participant {
  id: string;
  name: string;
  club: string;
  startTime?: string;
}

interface ParticipantClass {
  className: string;
  participants: Participant[];
}

const ParticipantsPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const [competition, setCompetition] = useState<CompetitionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [participantClasses, setParticipantClasses] = useState<ParticipantClass[]>([]);

  useEffect(() => {
    // Simulate API fetch with timeout
    const timer = setTimeout(() => {
      if (competitionId && mockCompetitionDetails[competitionId]) {
        const competitionData = mockCompetitionDetails[competitionId];
        setCompetition(competitionData);
        
        // Generate mock participant data for this competition
        const mockClasses = generateMockParticipantData();
        setParticipantClasses(mockClasses);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [competitionId]);

  // Function to generate mock participant data
  const generateMockParticipantData = (): ParticipantClass[] => {
    // Common Swedish orienteering classes
    const classes = [
      "H21", "D21", "H20", "D20", "H18", "D18", 
      "H16", "D16", "H14", "D14", "H12", "D12", "H10", "D10",
      "H40", "D40", "H50", "D50", "H60", "D60", "H70", "D70"
    ];
    
    // Swedish clubs
    const clubs = [
      "OK Linné", "IFK Göteborg", "Järla Orientering", 
      "OK Södertörn", "Stora Tuna OK", "Dalregementets IF",
      "IF Thor", "Attunda OK", "IFK Mora", "Malungs OK"
    ];
    
    // Swedish names
    const firstNames = [
      "Erik", "Lars", "Anders", "Johan", "Per", "Karl", "Nils", "Lennart", 
      "Anna", "Maria", "Karin", "Sara", "Lena", "Emma", "Eva", "Kristina"
    ];
    
    const lastNames = [
      "Andersson", "Johansson", "Karlsson", "Nilsson", "Eriksson", 
      "Larsson", "Olsson", "Persson", "Svensson", "Gustafsson"
    ];
    
    // Choose a random subset of classes for this competition
    const selectedClasses = classes
      .sort(() => Math.random() - 0.5)
      .slice(0, 8 + Math.floor(Math.random() * 8)); // 8-15 classes
    
    return selectedClasses.map(className => {
      // Generate 3-15 participants per class
      const participantCount = 3 + Math.floor(Math.random() * 13);
      const participants: Participant[] = [];
      
      for (let i = 0; i < participantCount; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const club = clubs[Math.floor(Math.random() * clubs.length)];
        
        // Random start time between 10:00 and 14:00
        const hour = 10 + Math.floor(Math.random() * 4);
        const minute = Math.floor(Math.random() * 6) * 10; // 0, 10, 20, 30, 40, 50
        const startTime = `${hour}:${minute.toString().padStart(2, '0')}`;
        
        participants.push({
          id: `p-${className}-${i}`,
          name: `${firstName} ${lastName}`,
          club,
          startTime
        });
      }
      
      // Sort participants by name
      participants.sort((a, b) => a.name.localeCompare(b.name));
      
      return {
        className,
        participants
      };
    }).sort((a, b) => a.className.localeCompare(b.className));
  };

  if (loading) {
    return (
      <MobileLayout title="Laddar..." showBackButton>
        <div className="flex justify-center items-center h-64 mt-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Toaster />
      </MobileLayout>
    );
  }

  if (!competition) {
    return (
      <MobileLayout title="Hittades inte" showBackButton>
        <div className="flex flex-col items-center justify-center h-64 mt-4">
          <div className="text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Tävlingen hittades inte</h2>
          <p className="text-gray-500 mt-2">Tävlingen du söker existerar inte</p>
        </div>
        <Toaster />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Anmälda deltagare" showBackButton>
      <div className="pb-4 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold">{competition.name}</h2>
          <p className="text-sm text-gray-500">{competition.club}</p>
        </div>
        
        {participantClasses.length > 0 ? (
          participantClasses.map((participantClass) => (
            <Card key={participantClass.className}>
              <CardHeader className="py-3">
                <CardTitle className="text-lg font-bold">{participantClass.className}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Namn</TableHead>
                      <TableHead>Klubb</TableHead>
                      <TableHead>Starttid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participantClass.participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell>{participant.name}</TableCell>
                        <TableCell>{participant.club}</TableCell>
                        <TableCell>{participant.startTime || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">Inga anmälda deltagare ännu</p>
          </div>
        )}
      </div>
      <Toaster />
    </MobileLayout>
  );
};

export default ParticipantsPage;
