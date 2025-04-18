
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { User, Flag, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';

const ProfilePage: React.FC = () => {
  return (
    <MobileLayout title="Profil">
      <div className="p-4 space-y-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Välkommen!</h2>
          <p className="text-gray-500 text-center mt-2 mb-4 px-4">
            Vi bygger just nu en ny tjänst för orienterare.
          </p>
        </div>

        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Flag className="text-primary w-5 h-5" />
            <div>
              <h3 className="font-medium">Tävlingar</h3>
              <p className="text-sm text-muted-foreground">
                Hitta och anmäl dig till tävlingar i hela Sverige
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Settings className="text-primary w-5 h-5" />
            <div>
              <h3 className="font-medium">Kommande funktioner</h3>
              <p className="text-sm text-muted-foreground">
                Anmälan, resultat och statistik kommer snart
              </p>
            </div>
          </div>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Version 1.0 - Beta
        </p>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;

