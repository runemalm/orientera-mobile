
import React, { useState, useEffect } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { User, MapPin, Award, Calendar, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProfilePage: React.FC = () => {
  // Mock user data
  const userData = {
    name: "Alex Johnson",
    club: "Northside Orienteers",
    registeredCompetitions: 3,
    completedCompetitions: 8
  };
  
  const navigate = useNavigate();
  
  // Added isLoading state to simulate authentication check
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Simulate authentication check
  useEffect(() => {
    const checkAuth = setTimeout(() => {
      // This would be replaced with actual auth check
      setIsLoading(false);
      setIsLoggedIn(false); // Default to not logged in until we implement real auth
    }, 1500);
    
    return () => clearTimeout(checkAuth);
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

  // Show login options when not logged in
  if (!isLoggedIn) {
    return (
      <MobileLayout title="Profil">
        <div className="space-y-6">
          <ProfileSkeleton />
          <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
              <div className="bg-primary/10 rounded-full p-6 mb-4 mx-auto w-24 h-24 flex items-center justify-center">
                <LogIn size={40} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">Logga in för att fortsätta</h2>
              <p className="text-gray-500 text-center mb-6">
                Du behöver logga in för att se och hantera din profil
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mb-3">
                    <LogIn size={18} />
                    <span>Logga in</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Logga in</DialogTitle>
                  </DialogHeader>
                  <div className="py-6">
                    <p className="text-center text-gray-500 mb-4">
                      Inloggningsfunktionen är under utveckling
                    </p>
                    <Button 
                      onClick={() => setIsLoggedIn(true)} 
                      className="w-full"
                    >
                      Test login (Tillfällig)
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                variant="outline" 
                className="w-full"
              >
                Skapa konto
              </Button>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // Normal profile view when logged in
  return (
    <MobileLayout title="Profil">
      <div className="space-y-6">
        {/* Profile header */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
          <div className="bg-primary/10 rounded-full p-4 mr-4">
            <User size={40} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{userData.name}</h2>
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-1" />
              <span>{userData.club}</span>
            </div>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center text-secondary mb-2">
              <Calendar size={20} className="mr-2" />
              <span className="font-semibold">Anmäld</span>
            </div>
            <p className="text-2xl font-bold">{userData.registeredCompetitions}</p>
            <p className="text-sm text-gray-500">Kommande tävlingar</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center text-primary mb-2">
              <Award size={20} className="mr-2" />
              <span className="font-semibold">Genomförda</span>
            </div>
            <p className="text-2xl font-bold">{userData.completedCompetitions}</p>
            <p className="text-sm text-gray-500">Tidigare tävlingar</p>
          </div>
        </div>
        
        {/* Placeholder for future features */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold mb-3">Mina tävlingar</h3>
          <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
            <Calendar size={32} className="text-gray-400 mb-2" />
            <p className="text-gray-500 text-center">Du har inga kommande tävlingar</p>
            <button 
              className="mt-4 bg-primary text-white py-2 px-4 rounded"
              onClick={goToCompetitions}
            >
              Hitta tävlingar
            </button>
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
    
    {/* Placeholder for future features */}
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
