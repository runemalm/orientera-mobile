
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { User, Mail, Award, Calendar, MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ProfilePage: React.FC = () => {
  return (
    <MobileLayout title="Min profil">
      <div className="p-4 space-y-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-1">Min profil</h2>
          <p className="text-gray-500 mb-8">Logga in för att se din profil</p>
          <Button size="lg" className="w-full max-w-xs animate-pulse">
            Logga in
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 px-1">
            Kommande funktioner
          </h3>
          
          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Award className="text-primary w-5 h-5" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-[180px]" />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="text-primary w-5 h-5" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-3 w-[160px]" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-primary w-5 h-5" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[130px]" />
                <Skeleton className="h-3 w-[170px]" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Settings className="text-primary w-5 h-5" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-3 w-[140px]" />
              </div>
            </div>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Vi jobbar på att göra din profil ännu bättre!
        </p>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
