
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Både användarnamn och lösenord krävs');
      return;
    }

    const success = await login(username, password);
    
    if (success) {
      toast.success('Inloggning lyckades!');
    } else {
      toast.error('Inloggning misslyckades');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Användarnamn</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          placeholder="Ange ditt användarnamn"
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Lösenord</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          placeholder="Ange ditt lösenord"
          className="w-full"
        />
      </div>
      
      {error && (
        <div className="text-sm text-red-500 mt-2">{error}</div>
      )}
      
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full mt-4"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loggar in...
          </>
        ) : (
          'Logga in'
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
