
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Info, Globe, Medal, Mail, MapPin, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const InfoPage: React.FC = () => {
  return (
    <MobileLayout title="Information">
      <div className="p-4 space-y-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Info className="text-primary mr-2" size={24} />
              <h2 className="text-xl font-bold">Om appen</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Välkommen till vår tävlingsapp! Här kan du hålla koll på kommande tävlingar, 
              registrera ditt intresse och se detaljerad information.
            </p>
            
            <Separator className="my-4" />
            
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="features">Funktioner</TabsTrigger>
                <TabsTrigger value="contact">Kontakt</TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="space-y-4 pt-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Tävlingsöversikt</h3>
                    <p className="text-sm text-gray-500">Bläddra bland aktuella och kommande tävlingar.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Medal className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Anmälningar</h3>
                    <p className="text-sm text-gray-500">Se status på dina anmälningar (kommer snart).</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <User className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Profil</h3>
                    <p className="text-sm text-gray-500">Hantera dina personuppgifter och inställningar (kommer snart).</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-4 pt-4">
                <p className="text-gray-700 mb-2">
                  Har du frågor eller förslag? Kontakta oss gärna!
                </p>
                
                <div className="flex items-start space-x-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">E-post</h3>
                    <p className="text-sm text-gray-500">kontakt@exempel.se</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Globe className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Webbplats</h3>
                    <p className="text-sm text-gray-500">www.exempel.se</p>
                  </div>
                </div>
                
                <Button className="w-full mt-4" variant="outline">Skicka feedback</Button>
              </TabsContent>
            </Tabs>
            
            <Separator className="my-4" />
            
            <div className="text-center text-sm text-gray-500">
              <p>Version 1.0.0</p>
              <p>© 2025 Alla rättigheter förbehållna</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default InfoPage;
