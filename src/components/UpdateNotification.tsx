
import React from 'react';
import { useVersionCheck } from '../hooks/useVersionCheck';
import { Button } from './ui/button';
import { RefreshCcw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const UpdateNotification = () => {
  const { newVersionAvailable, updateApp } = useVersionCheck();
  
  if (!newVersionAvailable) {
    return null;
  }
  
  // Create a handler that adapts the updateApp function to accept a MouseEvent
  const handleUpdateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    updateApp();
  };
  
  return (
    <div className="fixed top-0 inset-x-0 z-50 p-4 animate-in fade-in slide-in-from-top-5">
      <Alert variant="default" className="bg-primary text-primary-foreground border-primary/20">
        <RefreshCcw className="h-4 w-4" />
        <AlertTitle>Ny version tillgänglig</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>En ny version av appen finns tillgänglig.</span>
          <Button 
            onClick={handleUpdateClick}
            variant="secondary" 
            className="mt-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Uppdatera nu
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default UpdateNotification;
