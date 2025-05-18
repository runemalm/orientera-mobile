
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ArrowLeft } from 'lucide-react';

interface ProfileSettingsProps {
  userData: {
    name: string;
    email: string;
    club: string;
    preferredClass?: string;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    club: userData.club,
    preferredClass: userData.preferredClass || ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <Button variant="ghost" size="icon" onClick={onCancel} className="-ml-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-medium ml-2">Redigera profil</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-medium">Personlig information</h2>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Namn</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => handleChange('name', e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-postadress</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleChange('email', e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="club">Klubb</Label>
              <Input 
                id="club" 
                value={formData.club} 
                onChange={(e) => handleChange('club', e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferredClass">Föredragen klass</Label>
              <Select 
                value={formData.preferredClass}
                onValueChange={(value) => handleChange('preferredClass', value)}
              >
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
            
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" type="submit">
                Spara ändringar
              </Button>
              <Button className="flex-1" type="button" variant="outline" onClick={onCancel}>
                Avbryt
              </Button>
            </div>
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

                <Button variant="outline" className="w-full border-destructive text-destructive">
                  Ta bort mitt konto
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
