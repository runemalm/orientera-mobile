
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CallToActionProps {
  onAction: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onAction }) => {
  return (
    <div className="w-full px-4 space-y-4">
      <Button 
        onClick={onAction} 
        className="w-full py-7 text-lg font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
      >
        Hitta Tävlingar
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </Button>
      
      <p className="text-center text-sm text-muted-foreground px-6">
        Hitta, filtrera och anmäl dig till tävlingar – direkt i mobilen
      </p>
    </div>
  );
};

export default CallToAction;
