
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Competition } from '../types';
import { mockCompetitionDetails } from '../utils/mockData';
import { formatSwedishTime } from '../utils/dateUtils';

interface Participant {
  id: string;
  name: string;
  club: string;
  startTime: string;
}

interface StartTimeClass {
  className: string;
  participants: Participant[];
}

const StartTimesPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [startTimeClasses, setStartTimeClasses] = useState<StartTimeClass[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (competitionId && mockCompetitionDetails[competitionId]) {
        const competitionData = mockCompetitionDetails[competitionId];
        setCompetition(competitionData);
        
        const mockClasses = generateMockStartTimeData();
        setStartTimeClasses(mockClasses);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [competitionId]);

  const generateMockStartTimeData = (): StartTimeClass[] => {
    const classes = [
      "H21", "D21", "H20", "D20", "H18", "D18", 
      "H16", "D16", "H14", "D14", "H12", "D12", "H10", "D10",
      "H40", "D40", "H50", "D50", "H60", "D60", "H70", "D70"
    ];
    
    const clubs = [
      "OK Linné", "IFK Göteborg", "Järla Orientering", 
      "OK Södertörn", "Stora Tuna OK", "Dalregementets IF",
      "IF Thor", "Attunda OK", "IFK Mora", "Malungs OK"
    ];
    
    const firstNames = [
      "Erik", "Lars", "Anders", "Johan", "Per", "Karl", "Nils", "Lennart", 
      "Anna", "Maria", "Karin", "Sara", "Lena", "Emma", "Eva", "Kristina"
    ];
    
    const lastNames = [
      "Andersson", "Johansson", "Karlsson", "Nilsson", "Eriksson", 
      "Larsson", "Olsson", "Persson", "Svensson", "Gustafsson"
    ];
    
    const selectedClasses = classes
      .sort(() => Math.random() - 0.5)
      .slice(0, 8 + Math.floor(Math.random() * 8));
    
    return selectedClasses.map(className => {
      const participantCount = 3 + Math.floor(Math.random() * 13);
      const participants: Participant[] = [];
      
      let startHour = 10;
      let startMinute = 0;
      
      for (let i = 0; i < participantCount; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const club = clubs[Math.floor(Math.random() * clubs.length)];
        
        const formattedHour = startHour.toString().padStart(2, '0');
        const formattedMinute = startMinute.toString().padStart(2, '0');
        const startTime = `${formattedHour}:${formattedMinute}`;
        
        startMinute += 2;
        if (startMinute >= 60) {
          startHour += 1;
          startMinute = 0;
        }
        
        participants.push({
          id: `p-${className}-${i}`,
          name: `${firstName} ${lastName}`,
          club,
          startTime
        });
      }
      
      participants.sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
      });
      
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
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Starttider" showBackButton>
      <div className="pb-4 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold">{competition?.name}</h2>
          <p className="text-sm text-gray-500">{competition?.club}</p>
        </div>
        
        {startTimeClasses.length > 0 ? (
          startTimeClasses.map((startTimeClass) => (
            <Card key={startTimeClass.className}>
              <CardHeader className="py-3">
                <CardTitle className="text-lg font-bold">{startTimeClass.className}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Starttid</TableHead>
                      <TableHead>Namn</TableHead>
                      <TableHead>Klubb</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {startTimeClass.participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell className="font-medium">
                          {competition ? formatSwedishTime(participant.startTime, competition.date) : participant.startTime}
                        </TableCell>
                        <TableCell>{participant.name}</TableCell>
                        <TableCell>{participant.club}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">Inga starttider tillgängliga ännu</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default StartTimesPage;
