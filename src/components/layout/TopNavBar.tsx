
import React, { useState } from 'react';
import { MapPin, Menu } from 'lucide-react';
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerTrigger 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface TopNavBarProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ title, showBackButton = false, onBack }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="top-nav flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        {showBackButton ? (
          <button 
            onClick={onBack} 
            className="w-8 h-8 flex items-center justify-center text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center text-primary">
            <MapPin size={24} />
          </div>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600">
            <Menu size={24} />
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-4 space-y-4">
            <h3 className="text-lg font-semibold mb-4">Meny</h3>
            <div className="flex flex-col space-y-2">
              <DrawerClose asChild>
                <Link to="/" className="p-2 hover:bg-gray-100 rounded-md">Hem</Link>
              </DrawerClose>
              <DrawerClose asChild>
                <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-md">Min profil</Link>
              </DrawerClose>
            </div>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full mt-4">Stäng</Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default TopNavBar;
