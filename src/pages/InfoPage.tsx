
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
      <div className="p-4 space-y-8 pb-20">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Info className="text-primary" size={24} />
            </div>
            <h2 className="text-xl font-bold">Om appen</h2>
          </div>
          
          <div className="bg-gradient-to-br from-forest-light/20 to-forest-light/5 p-6 rounded-2xl">
            <h3 className="font-semibold text-lg mb-3">Orientering när du är på språng</h3>
            <p className="text-gray-700 leading-relaxed">
              Vi har skapat denna app för att möta orienterarens behov av snabb och enkel 
              information i vardagen. Oavsett om du är på väg till en tävling, planerar din 
              nästa aktivitet eller bara vill hålla dig uppdaterad - vi ger dig alla 
              viktiga orienteringsverktyg i en modern och lättanvänd mobilapp.
            </p>
          </div>
          
          <div className="space-y-5 mt-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full shrink-0 mt-1">
                <Compass className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-base mb-1">Vår vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  Att göra orientering mer tillgängligt genom en smidig, intuitiv plattform 
                  som förenklar alla aspekter av sporten - när du är hemma, på språng eller 
                  ute i terrängen.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full shrink-0 mt-1">
                <MapPin className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-base mb-1">För alla situationer</h3>
                <p className="text-gray-600 leading-relaxed">
                  Appen är designad för att möta dina behov i alla situationer - vare sig du står 
                  på en tävling, sitter på bussen, planerar din vecka eller bara vill kolla 
                  kommande events i närheten. Ett enkelt gränssnitt som fungerar när du är på språng.
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
                  Som aktiva orienterare förstår vi sportens unika behov och vardagens utmaningar. 
                  Vi har byggt denna app med fokus på enkelhet och användbarhet, så att du 
                  alltid har tillgång till rätt information när du behöver den, var du än är.
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
            Har du förslag på hur vi kan göra appen ännu mer användbar när du är på språng? 
            Eller vill du rapportera ett problem? Vi uppskattar all feedback som hjälper oss att förbättra upplevelsen.
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
        
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>
        
        <div className="text-center text-sm text-gray-500 pb-4">
          <p>Version 1.0.0</p>
          <p>© 2025 Alla rättigheter förbehållna</p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default InfoPage;
