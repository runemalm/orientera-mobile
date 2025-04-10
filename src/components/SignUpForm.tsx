
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface SignUpFormProps {
  competitionId: string;
  onSignUpComplete: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ competitionId, onSignUpComplete }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [club, setClub] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const categories = [
    "M21", "W21", "M20", "W20", "M18", "W18", 
    "M16", "W16", "M14", "W14", "M40", "W40", 
    "M50", "W50", "M60", "W60", "M70", "W70"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Registration successful!",
        description: "You have been registered for this competition.",
      });
      onSignUpComplete();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Your full name"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Your email address"
        />
      </div>
      
      <div>
        <label htmlFor="club" className="block text-sm font-medium text-gray-700 mb-1">
          Club
        </label>
        <input
          id="club"
          type="text"
          value={club}
          onChange={(e) => setClub(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Your orienteering club"
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          isSubmitting ? 'bg-gray-400' : 'bg-primary hover:bg-forest-dark'
        } transition-colors`}
      >
        {isSubmitting ? 'Registering...' : 'Register for Competition'}
      </button>
    </form>
  );
};

export default SignUpForm;
