
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

interface RadiusInputFormProps {
  initialRadius?: number;
  onRadiusSelected: (radius: number) => void;
  onCancel?: () => void;
}

const RadiusInputForm: React.FC<RadiusInputFormProps> = ({
  initialRadius = 100,
  onRadiusSelected,
  onCancel
}) => {
  const [radius, setRadius] = useState(initialRadius);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRadiusSelected(radius);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Max avstånd</span>
          <span className="text-sm text-muted-foreground">{radius} km</span>
        </div>
        <Slider
          value={[radius]}
          onValueChange={(value) => setRadius(value[0])}
          max={300}
          min={1}
          step={1}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Button type="submit" className="w-full">
          Spara
        </Button>
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="w-full"
          >
            Avbryt
          </Button>
        )}
      </div>
    </form>
  );
};

export default RadiusInputForm;
