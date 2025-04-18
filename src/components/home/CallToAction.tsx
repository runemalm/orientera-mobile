
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CallToActionProps {
  onAction: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onAction }) => {
  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <Button 
        onClick={onAction} 
        className="w-full py-7 text-lg font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
      >
        Visa tävlingar
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </Button>
    </div>
  );
};

export default CallToAction;
