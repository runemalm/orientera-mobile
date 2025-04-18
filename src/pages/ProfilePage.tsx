
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProfilePage: React.FC = () => {
  return (
    <MobileLayout title="Min profil">
      <div className="p-4">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-1">Min profil</h2>
          <p className="text-gray-500 mb-4">Logga in för att se din profil</p>
          <Button>Logga in</Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
