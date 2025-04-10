
import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Info, Send, MessageCircle, Heart, Compass, MapPin } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";

interface FeedbackFormValues {
  name: string;
  email: string;
  message: string;
}

const InfoPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FeedbackFormValues>({
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  });

  const onSubmit = (data: FeedbackFormValues) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Feedback submitted:', data);
      setIsSubmitting(false);
      setIsSuccess(true);
      form.reset();
    }, 1500);
  };

  return (
    <MobileLayout title="Om">
      <div className="p-4 space-y-8 pb-4">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Info className="text-primary" size={24} />
            </div>
            <h2 className="text-xl font-bold">Om appen</h2>
          </div>
          
          <div className="bg-gradient-to-br from-forest-light/20 to-forest-light/5 p-6 rounded-2xl">
            <h3 className="font-semibold text-lg mb-3">Orientering i din ficka</h3>
            <p className="text-gray-700 leading-relaxed">
              Vi har skapat denna app för att modernisera hur orienterare upptäcker, 
              anmäler sig till, och deltar i tävlingar. I en värld där allt blir mer 
              digitalt ville vi ge orienteringssporten ett modernt digitalt verktyg 
              som är lika funktionellt som det är enkelt att använda.
            </p>
          </div>
          
          <div className="space-y-5 mt-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full shrink-0 mt-1">
                <Compass className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-base mb-1">Vår mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  Att göra orientering mer tillgängligt genom en smidig, intuitiv plattform 
                  som förenklar alla aspekter av sporten - från att hitta närmaste tävling 
                  till att analysera dina resultat.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full shrink-0 mt-1">
                <MapPin className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-base mb-1">För alla orienterare</h3>
                <p className="text-gray-600 leading-relaxed">
                  Oavsett om du är elitlöpare, motionär eller nybörjare, är vår app 
                  designad för att möta dina behov med ett enkelt och rent gränssnitt 
                  som fungerar lika bra i skogen som i vardagen.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full shrink-0 mt-1">
                <Heart className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-base mb-1">Byggd av orienterare, för orienterare</h3>
                <p className="text-gray-600 leading-relaxed">
                  Som orienterare förstår vi sportens unika behov och utmaningar. Vi har byggt 
                  denna app med kärlek, kunskap och förståelse för vad som faktiskt behövs i fält.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>
        
        {isSuccess ? (
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
            <div className="flex items-center text-green-800 mb-1">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">Tack för din feedback!</span>
            </div>
            <p className="text-green-700 text-sm">
              Ditt meddelande har skickats. Vi uppskattar dina synpunkter och kommer att återkomma till dig om det behövs.
            </p>
          </div>
        ) : null}
        
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <MessageCircle className="text-primary" size={24} />
            </div>
            <h2 className="text-xl font-bold">Vi vill höra från dig!</h2>
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            Har du förslag på hur vi kan förbättra appen eller vill du rapportera ett problem? 
            Vi uppskattar all feedback som hjälper oss att göra appen bättre.
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Namn</FormLabel>
                    <FormControl>
                      <Input placeholder="Ditt namn" className="rounded-lg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">E-post</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Din e-postadress" className="rounded-lg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Meddelande</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Skriv ditt meddelande här..." 
                        className="min-h-[120px] rounded-lg"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full rounded-lg transition-all hover:shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Skickar...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Skicka feedback
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
        
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6"></div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Version 1.0.0</p>
          <p>© 2025 Alla rättigheter förbehållna</p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default InfoPage;
