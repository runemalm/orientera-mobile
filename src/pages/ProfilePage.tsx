
import React, { useState, useEffect } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { User, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(loadTimer);
  }, []);
  
  const goToCompetitions = () => {
    navigate('/');
  };

  // Show skeleton UI when loading
  if (isLoading) {
    return (
      <MobileLayout title="Profil">
        <div className="space-y-6">
          <ProfileSkeleton />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Profil">
      <div className="space-y-6 pb-6">
        {/* Profile feature unavailable notification */}
        <Card className="border-none">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-amber-100 rounded-full p-6 w-24 h-24 flex items-center justify-center">
                <AlertTriangle size={40} className="text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold">Profilfunktionen är inte tillgänglig</h2>
              <p className="text-gray-500 text-center max-w-xs">
                Profilfunktionen är under utveckling och kommer snart att bli tillgänglig. 
                Tack för ditt tålamod!
              </p>
              <Button 
                className="mt-2" 
                onClick={goToCompetitions}
              >
                Gå till tävlingar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder UI that shows what will be available */}
        <div className="bg-white/50 rounded-lg p-6 space-y-4 relative">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
            <div className="bg-white/90 px-6 py-4 rounded-lg shadow-sm">
              <p className="text-gray-500 text-center font-medium">Kommer snart</p>
            </div>
          </div>
          
          {/* Profile header mockup */}
          <div className="flex items-center">
            <div className="bg-primary/10 rounded-full p-4 mr-4">
              <User size={40} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-400">Användarnamn</h2>
              <div className="flex items-center text-gray-400">
                <MapPin size={16} className="mr-1" />
                <span>Klubb</span>
              </div>
            </div>
          </div>
          
          {/* Stats cards mockup */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/50 rounded-lg shadow-sm p-4">
              <div className="flex items-center text-secondary mb-2">
                <Calendar size={20} className="mr-2" />
                <span className="font-semibold text-gray-400">Anmäld</span>
              </div>
              <p className="text-2xl font-bold text-gray-300">-</p>
              <p className="text-sm text-gray-400">Kommande tävlingar</p>
            </div>
            <div className="bg-white/50 rounded-lg shadow-sm p-4">
              <div className="flex items-center text-primary mb-2">
                <Calendar size={20} className="mr-2" />
                <span className="font-semibold text-gray-400">Genomförda</span>
              </div>
              <p className="text-2xl font-bold text-gray-300">-</p>
              <p className="text-sm text-gray-400">Tidigare tävlingar</p>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

// Extracted skeleton component to reuse
const ProfileSkeleton = () => (
  <>
    {/* Profile header skeleton */}
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
      <Skeleton className="h-[64px] w-[64px] rounded-full mr-4" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
    
    {/* Stats cards skeleton */}
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <Skeleton className="h-5 w-1/2 mb-2" />
        <Skeleton className="h-8 w-[30px] mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <Skeleton className="h-5 w-1/2 mb-2" />
        <Skeleton className="h-8 w-[30px] mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
    
    {/* Placeholder skeleton */}
    <div className="bg-white rounded-lg shadow-sm p-4">
      <Skeleton className="h-5 w-1/4 mb-3" />
      <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
        <Skeleton className="h-[32px] w-[32px] rounded-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-10 w-[140px] rounded-md mt-2" />
      </div>
    </div>
  </>
);

export default ProfilePage;
