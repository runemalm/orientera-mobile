
import React from 'react';
import { Map, Calendar, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Map className="w-6 h-6 text-primary" />,
      title: 'Hitta tävlingar',
      description: 'Se tävlingar nära dig'
    },
    {
      icon: <Calendar className="w-6 h-6 text-primary" />,
      title: 'Planera säsongen',
      description: 'Håll koll på kommande events'
    },
    {
      icon: <Navigation className="w-6 h-6 text-primary" />,
      title: 'All information',
      description: 'PM, startlistor och resultat'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-4">
      {features.map((feature, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-primary/10 rounded-full">
              {feature.icon}
            </div>
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground text-sm">{feature.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Features;
