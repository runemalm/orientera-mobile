
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProfileSettingsProps {
  userData: {
    name: string;
    email: string;
    club: string;
    preferredClass?: string;
  };
  onCancel: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userData, onCancel }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onCancel} className="-ml-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-medium ml-2">Profilinformation</h2>
      </div>
      
      <div className="text-center py-8 text-muted-foreground">
        <p>Inställningar för profil är inte tillgängliga just nu.</p>
      </div>
      
      <div className="pt-2">
        <Button 
          className="w-full" 
          variant="outline" 
          onClick={onCancel}
        >
          Tillbaka
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
