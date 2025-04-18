
import React from 'react';
import { Map, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Map className="w-5 h-5 text-primary" />,
      title: 'Hitta tävlingar',
      description: 'Se tävlingar nära dig'
    },
    {
      icon: <Navigation className="w-5 h-5 text-primary" />,
      title: 'All information',
      description: 'PM, startlistor och resultat'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 w-full px-3">
      {features.map((feature, index) => (
        <Card key={index} className="p-3 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center space-y-1.5">
            <div className="p-2 bg-primary/10 rounded-full">
              {feature.icon}
            </div>
            <h3 className="font-medium text-sm">{feature.title}</h3>
            <p className="text-muted-foreground text-xs">{feature.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Features;
