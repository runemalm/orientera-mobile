
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { User, MapPin, Award, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  // Mock user data
  const userData = {
    name: "Alex Johnson",
    club: "Northside Orienteers",
    registeredCompetitions: 3,
    completedCompetitions: 8
  };
  
  const navigate = useNavigate();
  
  const goToCompetitions = () => {
    navigate('/');
  };

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

export default ProfilePage;
