
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Flag, Calendar, Award, MapPin } from 'lucide-react';
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
          <h1 className="text-lg font-semibold">Orientera.com</h1>
        </div>
      </header>
      
      {/* Hero section */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-3">
            <span className="whitespace-nowrap">Hitta och anmäl dig till</span>{' '}
            <span className="whitespace-nowrap">orienterings­tävlingar</span>
          </h1>
          <p className="text-gray-600 mb-8">
            Med Orientera.com kommer du enkelt åt all tävlingsinformation och kan anmäla dig med bara några få klick.
          </p>
          
          <Button 
            size="lg" 
            onClick={handleFindCompetitions} 
            className="w-full py-6 text-lg shadow-lg"
          >
            Hitta tävlingar
          </Button>
        </div>
        
        {/* About section - why we created this app */}
        <div className="mt-16 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3 text-primary">Varför vi skapade Orientera.com</h2>
          <p className="text-gray-700 mb-4">
            Som passionerade orienterare ville vi skapa ett enklare sätt att anmäla sig till 
            och få information om orienterings­tävlingar runt om i landet.
          </p>
          <p className="text-gray-700">
            Orientera.com gör det enkelt att snabbt komma åt all relevant tävlingsinformation, 
            från banor och klasser till starttider och resultat. Vår användarvänliga plattform 
            förenklar hela processen från att hitta en tävling till att anmäla sig.
          </p>
        </div>
        
        {/* Features section */}
        <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-md">
          <FeatureCard 
            icon={<MapPin className="text-primary" />}
            title="Hitta tävlingar"
            description="Baserat på din position"
          />
          <FeatureCard 
            icon={<Calendar className="text-primary" />}
            title="All information"
            description="Starttider, banor, PM m.m."
          />
          <FeatureCard 
            icon={<Flag className="text-primary" />}
            title="Enkel anmälan"
            description="Klicka och anmäl"
          />
          <FeatureCard 
            icon={<Award className="text-primary" />}
            title="Resultat"
            description="Direkt i appen"
          />
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
  <Card className="hover-scale">
    <CardContent className="flex flex-col items-center text-center p-4">
      <div className="mb-2">{icon}</div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </CardContent>
  </Card>
);

export default LandingPage;
