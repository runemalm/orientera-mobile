
import React from 'react';
import { Settings, User, LogOut, HelpCircle, CalendarRange, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import FixedBottomButton from '../components/common/FixedBottomButton';
import LinkListItem from '../components/competition/LinkListItem';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Placeholder for logout functionality
    console.log('Logout clicked');
  };

  return (
    <MobileLayout title="Profil">
      <div className="flex flex-col h-full">
        {/* User Profile Card */}
        <Card className="mx-4 mb-6 mt-2 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User size={24} />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">Orienteringsapp</h2>
                <p className="text-muted-foreground">Gäst</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="bg-white rounded-lg mx-4 mb-6 overflow-hidden shadow-sm">
          <h3 className="font-medium text-muted-foreground px-4 pt-4 pb-2 text-sm">Mina sidor</h3>
          <LinkListItem 
            icon={CalendarRange} 
            title="Mina tävlingar" 
            to="/competitions" 
            iconClassName="text-primary" 
          />
          <LinkListItem 
            icon={Star} 
            title="Favoriter" 
            to="/favorites" 
            iconClassName="text-secondary" 
          />
          <Separator />
          
          <h3 className="font-medium text-muted-foreground px-4 pt-4 pb-2 text-sm">Inställningar</h3>
          <LinkListItem 
            icon={Settings} 
            title="Appinställningar" 
            to="/settings" 
            iconClassName="text-gray-700" 
          />
          <LinkListItem 
            icon={HelpCircle}
            title="Hjälp & Support" 
            to="/assistant" 
            iconClassName="text-gray-700"
          />
        </div>

        {/* App Info */}
        <div className="flex-grow"></div>
        <div className="text-center text-sm text-muted-foreground px-4 mb-20">
          <p>Orienteringsapp v1.0.0</p>
          <p>© 2025 Orienteringsteamet</p>
        </div>
      </div>

      {/* Logout Button */}
      <FixedBottomButton
        onClick={handleLogout}
        className="bg-white text-primary border border-primary hover:bg-primary/5"
      >
        <div className="flex items-center justify-center gap-2">
          <LogOut size={18} />
          <span>Logga ut</span>
        </div>
      </FixedBottomButton>
    </MobileLayout>
  );
};

export default ProfilePage;
