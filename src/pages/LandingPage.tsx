
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, FileText, UserPlus, MapPin, List, Clock, Smartphone, Award } from 'lucide-react';
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
            <span className="whitespace-nowrap">Din moderna app</span>{' '}
            <span className="whitespace-nowrap">för orientering</span>
          </h1>
          <p className="text-gray-600 mb-8">
            Upptäck, planera och håll koll på orienterings­tävlingar på ett nytt och enklare sätt. Allt i din mobiltelefon.
          </p>
          
          <Button 
            size="lg" 
            onClick={handleFindCompetitions} 
            className="w-full py-6 text-lg shadow-lg hover:scale-105 transition-transform"
          >
            Hitta tävlingar
          </Button>
        </div>
        
        {/* Features section - enhanced with more orienteering-specific features */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
          <FeatureCard 
            icon={<MapPin className="text-primary" />}
            title="Hitta nära"
            description="Upptäck tävlingar nära dig"
          />
          <FeatureCard 
            icon={<Clock className="text-primary" />}
            title="Alltid aktuellt"
            description="Senaste uppdateringarna"
          />
          <FeatureCard 
            icon={<FileText className="text-primary" />}
            title="Dokument"
            description="PM och startlistor samlade"
          />
          <FeatureCard 
            icon={<List className="text-primary" />}
            title="Resultat"
            description="Följ resultat direkt"
          />
          <FeatureCard 
            icon={<Smartphone className="text-primary" />}
            title="Mobilanpassad"
            description="Optimerad för smartphones"
          />
          <FeatureCard 
            icon={<Award className="text-primary" />}
            title="Tävlingshistorik"
            description="Se dina tidigare resultat"
          />
          <FeatureCard 
            icon={<Compass className="text-primary" />}
            title="Navigering"
            description="Hitta till TC enkelt"
          />
          <FeatureCard 
            icon={<UserPlus className="text-primary" />}
            title="Personligt"
            description="Anpassat för dig"
          />
        </div>

        {/* App description */}
        <div className="mt-12 max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-3">Framtidens orienteringsapp</h2>
          <p className="text-gray-600">
            Orientera.com är skapad med fokus på användarvänlighet och snabbhet. 
            Få en bättre orienteringsupplevelse med modern teknik i en enkel app.
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
