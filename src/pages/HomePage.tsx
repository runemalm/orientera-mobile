
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Compass, MapPin, Calendar, Navigation } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout title="orientera.com">
      <div className="flex flex-col items-center h-full overflow-hidden">
        {/* Hero section */}
        <div className="flex flex-col items-center text-center space-y-6 mt-6 w-full px-4">
          <div className="relative">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <Compass className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl -z-10" />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              orientera.com
            </h1>
            <p className="text-muted-foreground mt-2">
              Hitta och planera dina orienteringstävlingar
            </p>
          </div>
        </div>
        
        {/* Features section */}
        <div className="grid grid-cols-2 gap-4 w-full mt-8 px-4 overflow-hidden">
          <FeatureCard 
            icon={<MapPin />} 
            title="Hitta tävlingar" 
            description="Se tävlingar nära dig"
          />
          <FeatureCard 
            icon={<Calendar />} 
            title="Tävlingsinfo" 
            description="PM, startlistor, resultat"
          />
          <FeatureCard 
            icon={<Navigation />} 
            title="Planering" 
            description="Förenkla din tävlingsdag"
          />
          <FeatureCard 
            icon={<Compass />} 
            title="Karta & arena" 
            description="Hitta till arenan enkelt"
          />
        </div>
      </div>
    </MobileLayout>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
      <div className="bg-primary/10 p-2 rounded-full mb-2">
        <div className="text-primary">{icon}</div>
      </div>
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

export default HomePage;
