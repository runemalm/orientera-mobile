
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface ProfileSettingsProps {
  userData: {
    name: string;
    email: string;
    club: string;
    preferredClass?: string;
  };
  onSave: (data: any) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userData, onSave }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-medium">Personlig information</h2>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Namn</Label>
              <Input id="name" defaultValue={userData.name} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-postadress</Label>
              <Input id="email" type="email" defaultValue={userData.email} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="club">Klubb</Label>
              <Input id="club" defaultValue={userData.club} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="class">Föredragen klass</Label>
              <Select defaultValue={userData.preferredClass || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj klass" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h21">H21</SelectItem>
                  <SelectItem value="d21">D21</SelectItem>
                  <SelectItem value="h40">H40</SelectItem>
                  <SelectItem value="d40">D40</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full" type="button" onClick={() => onSave(userData)}>
              Spara ändringar
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Collapsible className="w-full">
        <Card>
          <CardHeader className="pb-2">
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <h2 className="text-lg font-medium">Avancerade inställningar</h2>
              <ChevronDown className="h-5 w-5" />
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Exportera mina data
                </Button>
                
                <Button variant="destructive" className="w-full">
                  Logga ut
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};

export default ProfileSettings;
