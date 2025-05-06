
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WandSparkles, Send } from 'lucide-react';
import { toast } from 'sonner';

interface AiFilteringPageProps {}

const AiFilteringPage: React.FC<AiFilteringPageProps> = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Example suggestions to help users get started
  const exampleSuggestions = [
    "Visa tävlingar i Skåne",
    "Hitta långdistanstävlingar nästa månad",
    "Visa stafetter i Stockholm i sommar",
    "Hitta medeldistanstävlingar nära Göteborg"
  ];

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Ange en beskrivning av vad du letar efter");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // In a real implementation, this would call an AI service
      // and process the response to create filters
      
      toast.success("Filter skapade baserat på din förfrågan");
      setIsProcessing(false);
      
      // Navigate back to competitions with new filters applied
      navigate('/competitions');
    }, 1500);
  };

  return (
    <MobileLayout 
      title="AI-filter" 
      showBackButton={true}
    >
      <div className="flex flex-col h-full p-4 pb-8">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-forest-light p-4 rounded-full">
            <WandSparkles 
              className="h-8 w-8 text-white" 
              strokeWidth={2}
            />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-center mb-2">
          Filtrera med AI
        </h2>
        
        <p className="text-center text-muted-foreground mb-8">
          Beskriv vilka tävlingar du letar efter, så hjälper jag dig att filtrera dem.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6 flex-grow">
          <div className="flex-grow">
            <Label htmlFor="prompt" className="sr-only">Beskriv vilka tävlingar du letar efter</Label>
            <div className="relative">
              <Input
                id="prompt"
                value={prompt}
                onChange={handlePromptChange}
                placeholder="T.ex. 'Visa stafetter i juni'"
                className="pr-12 py-6 text-base"
                disabled={isProcessing}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                disabled={isProcessing || !prompt.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Send className={`h-5 w-5 ${isProcessing ? 'text-muted' : 'text-forest'}`} />
              </Button>
            </div>
          </div>

          {!isProcessing && suggestions.length === 0 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Exempel:</p>
              <div className="flex flex-wrap gap-2">
                {exampleSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-sm py-1 px-3 h-auto"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-forest mb-4"></div>
              <p className="text-muted-foreground">Skapar filter baserat på din beskrivning...</p>
            </div>
          )}
        </form>
      </div>
    </MobileLayout>
  );
};

export default AiFilteringPage;
