
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { UserSession } from '../../types';
import { LogOut, User } from 'lucide-react';

interface UserProfileProps {
  userSession: UserSession;
  onLogout: () => void;
  onRefresh: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  userSession, 
  onLogout, 
  onRefresh 
}) => {
  const fullName = [userSession.firstName, userSession.lastName]
    .filter(Boolean)
    .join(' ') || 'Användare';
    
  const initials = fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src="" alt={fullName} />
          <AvatarFallback className="text-xl bg-primary text-primary-foreground">
            {initials || <User />}
          </AvatarFallback>
        </Avatar>
        
        <h2 className="text-xl font-bold">{fullName}</h2>
        
        <div className="text-sm text-gray-500 mt-1">
          Användar-ID: {userSession.userId.slice(0, 8)}...
        </div>
      </div>
      
      <div className="space-y-4 mt-6">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center"
          onClick={onRefresh}
        >
          Uppdatera profil
        </Button>
        
        <Button 
          variant="destructive" 
          className="w-full flex items-center justify-center"
          onClick={onLogout}
        >
          <LogOut size={18} className="mr-2" />
          Logga ut
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
