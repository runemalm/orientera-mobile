
import React, { useState, useEffect } from 'react';
import { Settings, User, LogOut, HelpCircle, CalendarRange, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import FixedBottomButton from '../components/common/FixedBottomButton';
import LinkListItem from '../components/competition/LinkListItem';
import { Badge } from '@/components/ui/badge';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [myCompetitionsCount, setMyCompetitionsCount] = useState<number>(0);
  
  // Load favorites count from localStorage
  useEffect(() => {
    const storedFavoritesStr = window.localStorage.getItem('favoriteCompetitions');
    if (storedFavoritesStr) {
      try {
        const parsed = JSON.parse(storedFavoritesStr);
        setFavoriteCount(Array.isArray(parsed) ? parsed.length : 0);
      } catch (error) {
        console.error('Error parsing favorites:', error);
        setFavoriteCount(0);
      }
    }
    
    // For now, we'll set myCompetitionsCount to 0
    // This would typically be fetched from an API or localStorage
    setMyCompetitionsCount(0);
  }, []);
  
  const handleLogout = () => {
    // Placeholder for logout functionality
    console.log('Logout clicked');
  };

  const navigateToComingSoon = (feature: string) => {
    navigate('/coming-soon', { state: { from: feature } });
  };

  return (
    <MobileLayout title="Profil">
      <div className="flex flex-col h-full">
        {/* User Profile Card */}
        <Card className="mx-4 mb-6 mt-2 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src="/user-avatar.svg" alt="User" />
                <AvatarFallback className="bg-primary/20 h-16 w-16 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">Orientera.com</h2>
                <p className="text-muted-foreground">Gäst</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="bg-white rounded-lg mx-4 mb-6 overflow-hidden shadow-sm">
          <h3 className="font-medium text-muted-foreground px-4 pt-4 pb-2 text-sm">Mina sidor</h3>
          <div onClick={() => navigateToComingSoon('Mina tävlingar')}>
            <LinkListItem 
              icon={CalendarRange} 
              title={
                <div className="flex items-center gap-2">
                  <span>Mina tävlingar</span>
                  {myCompetitionsCount > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs py-0 h-5">
                      {myCompetitionsCount}
                    </Badge>
                  )}
                </div>
              }
              to="#" 
              iconClassName="text-primary" 
            />
          </div>
          <div onClick={() => navigate('/favorites')}>
            <LinkListItem 
              icon={Star} 
              title={
                <div className="flex items-center gap-2">
                  <span>Favoriter</span>
                  {favoriteCount > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs py-0 h-5">
                      {favoriteCount}
                    </Badge>
                  )}
                </div>
              }
              to="#" 
              iconClassName="text-secondary" 
            />
          </div>
          <Separator />
          
          <h3 className="font-medium text-muted-foreground px-4 pt-4 pb-2 text-sm">Inställningar</h3>
          <div onClick={() => navigateToComingSoon('Appinställningar')}>
            <LinkListItem 
              icon={Settings} 
              title="Appinställningar" 
              to="#" 
              iconClassName="text-gray-700" 
            />
          </div>
          <div onClick={() => navigateToComingSoon('Hjälp & Support')}>
            <LinkListItem 
              icon={HelpCircle}
              title="Hjälp & Support" 
              to="#" 
              iconClassName="text-gray-700"
            />
          </div>
        </div>

        {/* App Info */}
        <div className="flex-grow"></div>
        <div className="text-center text-sm text-muted-foreground px-4 mb-20">
          <p>Orientera.com v1.0.0-alpha.1</p>
          <p>© 2025 Team Orientera.com</p>
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
