
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LoginWaitlistDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginWaitlistDialog: React.FC<LoginWaitlistDialogProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      console.error('Invalid email address');
      return;
    }

    console.log('Email submitted to waitlist:', email);
    setIsSubmitted(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Gå med i väntelistan</DialogTitle>
          <DialogDescription>
            Inloggningsfunktionen kommer snart! Gå med i väntelistan för att få tidig tillgång.
          </DialogDescription>
        </DialogHeader>
        
        {isSubmitted ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-medium text-lg">Tack för ditt intresse!</h3>
            <p className="text-muted-foreground">
              Vi meddelar dig när inloggningsfunktionen är tillgänglig.
            </p>
            <Button onClick={onClose} className="mt-4">
              Stäng
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-postadress
              </label>
              <Input
                id="email"
                type="email"
                placeholder="du@exempel.se"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
                autoFocus={!isMobile}
              />
              <p className="text-xs text-muted-foreground">
                Vi delar aldrig din e-postadress med någon annan.
              </p>
            </div>
            
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={onClose}>
                Avbryt
              </Button>
              <Button type="submit">
                Gå med
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginWaitlistDialog;
