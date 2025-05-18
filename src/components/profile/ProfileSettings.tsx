
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Home, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      
      <Card className="border-primary/20 overflow-hidden">
        <CardHeader className="pb-2 bg-primary/5">
          <h2 className="text-lg font-medium">Personlig information</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            <InfoItem 
              icon={<User className="h-4 w-4 text-primary/70" />}
              label="Namn"
              value={userData.name}
            />
            
            <InfoItem 
              icon={<Mail className="h-4 w-4 text-primary/70" />}
              label="E-postadress"
              value={userData.email}
            />
            
            <InfoItem 
              icon={<Home className="h-4 w-4 text-primary/70" />}
              label="Klubb"
              value={userData.club}
            />
            
            <InfoItem 
              icon={<Flag className="h-4 w-4 text-primary/70" />}
              label="Föredragen klass"
              value={userData.preferredClass || "-"}
              isLast
            />
          </div>
        </CardContent>
      </Card>
      
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

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLast?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, isLast = false }) => {
  return (
    <div className={cn("px-6 py-4 flex items-start", !isLast && "border-b border-border/40")}>
      <div className="mr-3 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-medium">{value}</p>
      </div>
    </div>
  );
};

export default ProfileSettings;
