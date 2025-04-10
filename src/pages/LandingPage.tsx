
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Flag, Calendar, Award } from 'lucide-react';
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
          <MapPin size={24} className="text-primary" />
          <h1 className="text-lg font-semibold">Orientera.com</h1>
        </div>
      </header>
      
      {/* Hero section */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-3">Hitta orienterings­tävlingar nära dig</h1>
          <p className="text-gray-600 mb-8">
            Med Orientera.com kan du enkelt hitta och anmäla dig till orienterings­tävlingar i hela landet.
          </p>
          
          <Button 
            size="lg" 
            onClick={handleFindCompetitions} 
            className="w-full py-6 text-lg shadow-lg"
          >
            Hitta tävlingar
          </Button>
        </div>
        
        {/* Features section */}
        <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-md">
          <FeatureCard 
            icon={<MapPin className="text-primary" />}
            title="Hitta nära"
            description="Tävlingar baserat på din position"
          />
          <FeatureCard 
            icon={<Calendar className="text-primary" />}
            title="Planera"
            description="Se kommande tävlingar"
          />
          <FeatureCard 
            icon={<Flag className="text-primary" />}
            title="Anmäl dig"
            description="Snabb och enkel anmälan"
          />
          <FeatureCard 
            icon={<Award className="text-primary" />}
            title="Resultat"
            description="Se dina tävlingsresultat"
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
