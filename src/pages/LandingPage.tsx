
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, FileText, MapPin, List, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleFindCompetitions = () => {
    navigate('/competitions');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/5 to-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Compass size={24} className="text-primary" />
          <h1 className="text-lg font-semibold">orientera.com</h1>
        </div>
      </header>
      
      {/* Hero section */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-3">
            <span className="whitespace-nowrap">Hitta orienterings­tävlingar</span>{' '}
            <span className="whitespace-nowrap">enkelt</span>
          </h1>
          <p className="text-gray-600 mb-8">
            Upptäck kommande orienterings­tävlingar och få tillgång till all väsentlig information samlad på ett ställe.
          </p>
          
          <Button 
            size="lg" 
            onClick={handleFindCompetitions} 
            className="w-full py-6 text-lg shadow-lg hover:scale-105 transition-transform"
          >
            Hitta tävlingar
          </Button>
        </div>
        
        {/* Features section - focused on existing functionality */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl">
          <FeatureCard 
            icon={<MapPin className="text-primary" />}
            title="Hitta tävlingar"
            description="Se tävlingar nära dig"
          />
          <FeatureCard 
            icon={<Calendar className="text-primary" />}
            title="Datum & tid"
            description="Tydlig översikt av kommande tävlingar"
          />
          <FeatureCard 
            icon={<FileText className="text-primary" />}
            title="Dokument"
            description="PM och startlistor samlade"
          />
          <FeatureCard 
            icon={<List className="text-primary" />}
            title="Tävlingsinfo"
            description="Detaljerad information"
          />
          <FeatureCard 
            icon={<Compass className="text-primary" />}
            title="Plats"
            description="Se var tävlingen hålls"
          />
          <FeatureCard 
            icon={<Info className="text-primary" />}
            title="Anmälan"
            description="Länk till Eventor"
          />
        </div>

        {/* App description */}
        <div className="mt-12 max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-3">Allt på ett ställe</h2>
          <p className="text-gray-600">
            Slipp leta på olika hemsidor efter information om tävlingar. 
            Orientera.com samlar allt du behöver veta på ett ställe.
          </p>
        </div>
      </main>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Card className="hover:scale-105 transition-duration-200">
    <CardContent className="flex flex-col items-center text-center p-4">
      <div className="mb-2">{icon}</div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </CardContent>
  </Card>
);

export default LandingPage;
