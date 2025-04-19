import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFormattedLocation } from '../utils/locationUtils';
import MobileLayout from '../components/layout/MobileLayout';
import { Car, MapPin, Clock, Users, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import OfferRideForm from '../components/carpooling/OfferRideForm';
import { Toaster } from '@/components/ui/toaster';
import { getCompetitionById } from '../services/api';
import { Competition } from '../types';

const mockRides = [
  {
    id: 'ride-1',
    driverName: 'Johan Andersson',
    startLocation: 'Stockholm',
    departureTime: '06:30',
    availableSeats: 3,
    participants: ['Maria Eriksson'],
    notes: 'Samling vid ICA Maxi parkering. Tar med extra utrustning om någon behöver.'
  },
  {
    id: 'ride-2',
    driverName: 'Lisa Nilsson',
    startLocation: 'Uppsala',
    departureTime: '07:15',
    availableSeats: 2,
    participants: ['Erik Karlsson', 'Anna Svensson'],
    notes: 'Kan plocka upp längs väg 55. Har plats för extra ryggsäckar.'
  }
];

const CarpoolingPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rides] = useState(mockRides);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const { toast } = useToast();

  console.log("CarpoolingPage rendered, competitionId:", competitionId);

  useEffect(() => {
    const fetchCompetition = async () => {
      if (!competitionId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getCompetitionById(competitionId);
        console.log("API returned competition:", data);
        setCompetition(data);
      } catch (err) {
        console.error('Error fetching competition details:', err);
        setError('Det gick inte att hämta tävlingsinformation. Försök igen senare.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, [competitionId]);

  const handleJoinRide = (rideId: string) => {
    toast({
      title: "Förfrågan skickad",
      description: "Chauffören har meddelats om din förfrågan.",
    });
  };

  if (loading) {
    return (
      <MobileLayout title="Laddar..." showBackButton>
        <div className="flex flex-col justify-center items-center h-64 mt-4 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-500">Hämtar information om samåkning...</p>
        </div>
        <Toaster />
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout title="Fel" showBackButton>
        <div className="flex flex-col items-center justify-center h-64 mt-8 px-4 text-center">
          <div className="bg-red-100 rounded-full p-4 mb-4">
            <Car size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold">Ett fel uppstod</h2>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
        <Toaster />
      </MobileLayout>
    );
  }

  if (!competition) {
    return (
      <MobileLayout title="Hittades inte" showBackButton>
        <div className="flex flex-col items-center justify-center h-64 mt-8 px-4 text-center">
          <div className="bg-red-100 rounded-full p-4 mb-4">
            <Car size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold">Tävlingen hittades inte</h2>
          <p className="text-gray-500 mt-2">Vi kunde tyvärr inte hitta information om samåkning.</p>
        </div>
        <Toaster />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Samåkning" showBackButton>
      <div className="space-y-4 pb-4">
        <div className="bg-primary/10 p-4 rounded-lg">
          <h2 className="font-semibold">{competition.name}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <MapPin size={16} />
            <span>{getFormattedLocation(
              competition.location, 
              competition.latitude, 
              competition.longitude
            )}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>
              {new Date(competition.date).toLocaleDateString('sv-SE')} {competition.startTime ? `- ${competition.startTime}` : ''}
            </span>
          </div>
        </div>

        <Button onClick={() => setShowOfferForm(true)} className="w-full">
          <Plus size={16} className="mr-2" />
          Erbjud samåkning
        </Button>

        <div>
          <h3 className="font-semibold text-lg mb-2">Tillgängliga samåkningar</h3>
          
          {rides.length === 0 ? (
            <Card className="p-4 text-center text-gray-500">
              <p>Inga samåkningar tillgängliga ännu.</p>
              <p className="text-sm mt-2">Var den första att erbjuda samåkning!</p>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {rides.map((ride) => (
                <AccordionItem key={ride.id} value={ride.id} className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 [&>svg]:text-primary [&>svg]:data-[state=open]:text-primary">
                    <div className="flex-1 text-left">
                      <div className="font-medium">{ride.startLocation}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock size={14} />
                        {ride.departureTime}
                        <Separator orientation="vertical" className="mx-1 h-3" />
                        <Users size={14} />
                        {ride.availableSeats} platser kvar
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableHead className="w-1/3">Chaufför</TableHead>
                          <TableCell>{ride.driverName}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Avfärd</TableHead>
                          <TableCell>{ride.departureTime} från {ride.startLocation}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Platser</TableHead>
                          <TableCell>{ride.availableSeats} av {ride.availableSeats + ride.participants.length}</TableCell>
                        </TableRow>
                        {ride.notes && (
                          <TableRow>
                            <TableHead>Anteckningar</TableHead>
                            <TableCell>{ride.notes}</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Passagerare:</h4>
                      {ride.participants.length > 0 ? (
                        <div className="space-y-2">
                          {ride.participants.map((participant, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <User size={14} className="text-gray-500" />
                              {participant}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Inga passagerare ännu</p>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => handleJoinRide(ride.id)} 
                      className="w-full mt-4"
                      disabled={ride.availableSeats === 0}
                    >
                      {ride.availableSeats > 0 ? 'Begär att få åka med' : 'Fullt'}
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>

      <Dialog open={showOfferForm} onOpenChange={setShowOfferForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Erbjud samåkning</DialogTitle>
          </DialogHeader>
          <OfferRideForm onClose={() => setShowOfferForm(false)} />
        </DialogContent>
      </Dialog>
      <Toaster />
    </MobileLayout>
  );
};

export default CarpoolingPage;
