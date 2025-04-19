
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface OfferRideFormProps {
  onClose: () => void;
}

const OfferRideForm: React.FC<OfferRideFormProps> = ({ onClose }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Ride offer submitted');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="startLocation">Avreseort</Label>
        <Input id="startLocation" placeholder="T.ex. Stockholm" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="departureTime">Avresetid</Label>
        <Input id="departureTime" type="time" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="seats">Antal platser</Label>
        <Input id="seats" type="number" min="1" max="8" defaultValue="3" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Anteckningar</Label>
        <Textarea 
          id="notes" 
          placeholder="T.ex. Samling vid ICA Maxi parkering..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" type="button" onClick={onClose}>
          Avbryt
        </Button>
        <Button type="submit">
          Erbjud samåkning
        </Button>
      </div>
    </form>
  );
};

export default OfferRideForm;
