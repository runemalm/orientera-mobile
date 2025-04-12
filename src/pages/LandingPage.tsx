
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, MapPin, Calendar, Navigation, FileText, RefreshCw, ArrowRight, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  
  const handleFindCompetitions = () => {
    navigate('/competitions');
  };

  const handleFeatureCardTap = (title: string) => {
    if (title === 'Tävlingar nära dig') {
      const currentTime = new Date().getTime();
      
      // Reset count if more than 1.5 seconds between taps
      if (currentTime - lastTapTime > 1500) {
        setTapCount(1);
      } else {
        setTapCount(prev => prev + 1);
      }
      
      setLastTapTime(currentTime);
      
      // Reload page after 5 quick taps
      if (tapCount === 4) {
        window.location.reload();
      }
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/10 to-white">
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Compass size={24} className="text-primary" />
          <h1 className="text-lg font-semibold">orientera.com</h1>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-3 flex flex-col items-center">
            <span className="block">Orientering</span>
            <span className="block">i farten</span>
          </h1>
          <p className="text-gray-600 mb-8">
            Hitta tävlingar nära dig, se PM, startlistor och annan information var du än befinner dig - perfekt när du är på språng.
          </p>
          
          <Button 
            size="lg" 
            onClick={handleFindCompetitions} 
            className="w-full py-6 text-lg shadow-lg hover:scale-105 transition-transform group"
          >
            Hitta tävlingar <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl">
          <FeatureCard 
            icon={<MapPin className="text-primary" />}
            title="Tävlingar nära dig"
            description="Hitta orienteringstävlingar i närheten"
            onTap={handleFeatureCardTap}
          />
          <FeatureCard 
            icon={<Navigation className="text-primary" />}
            title="På språng"
            description="Enkel åtkomst var du än befinner dig"
          />
          <FeatureCard 
            icon={<Calendar className="text-primary" />}
            title="Kommande tävlingar"
            description="Se när tävlingar äger rum"
          />
          <FeatureCard 
            icon={<FileText className="text-primary" />}
            title="Tävlingsdokument"
            description="PM och startlistor när du behöver dem"
          />
          <FeatureCard 
            icon={<Smartphone className="text-primary" />}
            title="Mobiloptimerad"
            description="Designad för att användas i farten"
          />
          <FeatureCard 
            icon={<RefreshCw className="text-primary" />}
            title="Samma data"
            description="Eventor-data i ett bättre gränssnitt"
          />
        </div>

        <div className="mt-12 max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-3">När du är på språng</h2>
          <p className="text-gray-600">
            Slut på krångliga menyer och långa laddningstider - med denna app hittar du enkelt tävlingar var du än är
            och kommer snabbt åt den information du behöver, vare sig du är på en tävling, planerar ditt deltagande hemifrån 
            eller är på väg till nästa event.
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
  onTap?: (title: string) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, onTap }) => (
  <Card 
    className="border border-gray-100 bg-white/80 shadow-sm cursor-default"
    onClick={() => onTap?.(title)}
  >
    <CardContent className="flex flex-col items-center text-center p-4">
      <div className="mb-2">{icon}</div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </CardContent>
  </Card>
);

export default LandingPage;
