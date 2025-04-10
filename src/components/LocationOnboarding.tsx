
// This file is kept but unused since we're replacing the dialog with inline location selection
import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import LocationInputForm from './LocationInputForm';

interface LocationOnboardingProps {
  isOpen: boolean;
  onComplete: (location: { city: string; latitude: number; longitude: number }) => void;
}

const LocationOnboarding: React.FC<LocationOnboardingProps> = ({ isOpen, onComplete }) => {
  return (
    <Dialog 
      open={isOpen}
    >
      <DialogContent 
        className="max-w-md"
        onPointerDownOutside={(e) => {
          // Prevent closing when clicking outside
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing with Escape key
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <div className="bg-primary/10 p-3 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
            <MapPin size={28} className="text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">Välkommen!</DialogTitle>
          <DialogDescription className="text-center">
            Ange din plats för att hitta orienteringstävlingar nära dig.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <LocationInputForm onLocationSelected={onComplete} />
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Din position sparas på din enhet för framtida besök.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationOnboarding;
