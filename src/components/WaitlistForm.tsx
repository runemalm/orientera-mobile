
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WaitlistFormProps {
  competitionId: string;
  onComplete: () => void;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ competitionId, onComplete }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [club, setClub] = useState('');
  const [notification, setNotification] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Du är nu på väntelistan!",
        description: "Vi meddelar dig när registreringen öppnar",
      });
      onComplete();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Namn
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Ditt namn"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          E-post
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Din e-postadress"
        />
      </div>
      
      <div>
        <label htmlFor="club" className="block text-sm font-medium text-gray-700 mb-1">
          Klubb
        </label>
        <input
          id="club"
          type="text"
          value={club}
          onChange={(e) => setClub(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Din orienteringsklubb"
        />
      </div>
      
      <div className="flex items-center">
        <input
          id="notification"
          type="checkbox"
          checked={notification}
          onChange={(e) => setNotification(e.target.checked)}
          className="h-4 w-4 text-primary border-gray-300 rounded"
        />
        <label htmlFor="notification" className="ml-2 block text-sm text-gray-700">
          Meddela mig när registreringen öppnar
        </label>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          isSubmitting ? 'bg-gray-400' : 'bg-primary hover:bg-forest-dark'
        } transition-colors`}
      >
        {isSubmitting ? 'Skickar...' : 'Ställ mig på väntelistan'}
      </button>
    </form>
  );
};

export default WaitlistForm;
