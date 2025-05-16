
import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { useAuth } from '../hooks/useAuth';
import UserProfile from '../components/profile/UserProfile';
import LoginForm from '../components/profile/LoginForm';
import { toast } from 'sonner';
import LoginWaitlistDialog from '../components/profile/LoginWaitlistDialog';

const ProfilePage: React.FC = () => {
  const { userSession, isLoggedIn, logout, refreshProfile } = useAuth();
  const [showLoginWaitlist, setShowLoginWaitlist] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Du har loggat ut');
  };

  const handleRefreshProfile = async () => {
    await refreshProfile();
    toast.success('Profilen uppdaterad');
  };

  return (
    <MobileLayout title="Min profil">
      <div className="px-4 pt-2 pb-6">
        {isLoggedIn && userSession ? (
          <UserProfile 
            userSession={userSession} 
            onLogout={handleLogout} 
            onRefresh={handleRefreshProfile}
          />
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Välkommen!</h2>
              <p className="text-gray-600">Logga in för att se din profil</p>
            </div>
            
            <LoginForm />
            
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">Har du inget konto?</p>
              <button 
                onClick={() => setShowLoginWaitlist(true)}
                className="text-primary hover:underline text-sm font-medium"
              >
                Gå med i väntelistan för nya användare
              </button>
            </div>
          </div>
        )}
        
        <LoginWaitlistDialog 
          isOpen={showLoginWaitlist} 
          onClose={() => setShowLoginWaitlist(false)}
        />
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
