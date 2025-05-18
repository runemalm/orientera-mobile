
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
      <div className="flex items-center mb-2">
        <Button variant="ghost" size="icon" onClick={onCancel} className="-ml-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-medium ml-2">Profilinformation</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-medium">Personlig information</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Namn</p>
              <p className="text-base">{userData.name}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">E-postadress</p>
              <p className="text-base">{userData.email}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Klubb</p>
              <p className="text-base">{userData.club}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Föredragen klass</p>
              <p className="text-base">{userData.preferredClass || "-"}</p>
            </div>
            
            <div className="pt-2">
              <Button className="w-full" variant="outline" onClick={onCancel}>
                Tillbaka
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
