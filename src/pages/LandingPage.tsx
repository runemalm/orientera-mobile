
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, FileText, MapPin, List, Calendar, Smartphone, ArrowRight, RefreshCw } from 'lucide-react';
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
    if (title === 'Hitta tävlingar') {
      const currentTime = new Date().getTime();
      
      // Reset count if more than 1.5 seconds between taps
      if (currentTime - lastTapTime > 1500) {
        setTapCount(1);
      } else {
        setTapCount(prev => prev + 1);
      }
      
      setLastTapTime(currentTime);
      
      // Reload page after 10 quick taps
      if (tapCount === 9) {
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
            <span className="block">Ett modernare sätt</span>
            <span className="block">att hitta orienterings­tävlingar</span>
          </h1>
          <p className="text-gray-600 mb-8">
            Samma information som Eventor men i ett användarvänligt, modernt gränssnitt optimerat för mobilen.
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
            title="Hitta tävlingar"
            description="Se tävlingar nära dig"
            onTap={handleFeatureCardTap}
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
            icon={<RefreshCw className="text-primary" />}
            title="Eventor-data"
            description="Samma info, bättre upplevelse"
          />
          <FeatureCard 
            icon={<Smartphone className="text-primary" />}
            title="Modern design"
            description="Optimerad för mobilen"
          />
        </div>

        <div className="mt-12 max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-3">Ett modernt alternativ till Eventor</h2>
          <p className="text-gray-600">
            Vi hämtar data från Eventor men presenterar den i ett modernare och mer användarvänligt gränssnitt, 
            optimerat för att användas på din mobil när du är ute på tävling.
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
