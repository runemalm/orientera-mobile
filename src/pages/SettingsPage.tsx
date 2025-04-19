
import React from 'react';
import { Settings, Map, Bell, Languages, UserRound, Shield } from 'lucide-react';
import MobileLayout from '../components/layout/MobileLayout';
import { useUserLocation } from '../hooks/useUserLocation';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const SettingsPage: React.FC = () => {
  const { userLocation, resetUserLocation } = useUserLocation();

  const handleResetLocation = () => {
    resetUserLocation();
  };

  return (
    <MobileLayout title="Inställningar">
      <div className="p-4 space-y-6">
        {/* Location Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">Plats</h2>
          </div>
          <div className="rounded-lg bg-card p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Nuvarande plats</p>
                <p className="text-sm text-muted-foreground">{userLocation.city}</p>
              </div>
              <button 
                onClick={handleResetLocation}
                className="text-sm text-primary hover:underline"
              >
                Återställ
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="location-permission" />
              <Label htmlFor="location-permission">Tillåt platsåtkomst</Label>
            </div>
          </div>
        </section>

        <Separator />

        {/* Notification Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">Notifikationer</h2>
          </div>
          <div className="rounded-lg bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-competitions">Nya tävlingar i närheten</Label>
              <Switch id="notify-competitions" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-results">Resultatuppdateringar</Label>
              <Switch id="notify-results" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-deadlines">Anmälningsdeadlines</Label>
              <Switch id="notify-deadlines" />
            </div>
          </div>
        </section>

        <Separator />

        {/* Display Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">Visningsalternativ</h2>
          </div>
          <div className="rounded-lg bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="distance-unit">Visa avstånd i kilometer</Label>
              <Switch id="distance-unit" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="list-compact">Kompakt tävlingslista</Label>
              <Switch id="list-compact" />
            </div>
          </div>
        </section>

        <Separator />

        {/* Language Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">Språk</h2>
          </div>
          <div className="rounded-lg bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nuvarande språk</p>
                <p className="text-sm text-muted-foreground">Svenska</p>
              </div>
              <button 
                className="text-sm text-primary hover:underline"
              >
                Byt språk
              </button>
            </div>
          </div>
        </section>

        <Separator />

        {/* Account Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">Konto</h2>
          </div>
          <div className="rounded-lg bg-card p-4 space-y-3">
            <button className="text-primary hover:underline text-left">Hantera din profil</button>
            <button className="text-primary hover:underline text-left">Koppla till Eventor</button>
            <button className="text-primary hover:underline text-left">Hantera klubblänkar</button>
          </div>
        </section>

        <Separator />

        {/* Privacy Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">Integritet och säkerhet</h2>
          </div>
          <div className="rounded-lg bg-card p-4 space-y-3">
            <button className="text-primary hover:underline text-left">Integritetspolicy</button>
            <button className="text-primary hover:underline text-left">Hantera data</button>
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics">Dela anonym statistik</Label>
              <Switch id="analytics" defaultChecked />
            </div>
          </div>
        </section>

        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Orientera v1.0.0
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SettingsPage;
