
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
      <div className="p-4 space-y-6 pb-16">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Info className="text-primary mr-2" size={24} />
              <h2 className="text-xl font-bold">Om appen</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Orientering i din ficka</h3>
                <p className="text-gray-700">
                  Vi har skapat denna app för att modernisera hur orienterare upptäcker, 
                  anmäler sig till, och deltar i tävlingar. I en värld där allt blir mer 
                  digitalt ville vi ge orienteringssporten ett modernt digitalt verktyg 
                  som är lika funktionellt som det är enkelt att använda.
                </p>
              </div>
              
              <div className="flex items-start space-x-3 mt-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Compass className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-medium">Vår mission</h3>
                  <p className="text-sm text-gray-600">
                    Att göra orientering mer tillgängligt genom en smidig, intuitiv plattform 
                    som förenklar alla aspekter av sporten - från att hitta närmaste tävling 
                    till att analysera dina resultat.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mt-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MapPin className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-medium">För alla orienterare</h3>
                  <p className="text-sm text-gray-600">
                    Oavsett om du är elitlöpare, motionär eller nybörjare, är vår app 
                    designad för att möta dina behov med ett enkelt och rent gränssnitt 
                    som fungerar lika bra i skogen som i vardagen.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 mt-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Heart className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-medium">Byggd av orienterare, för orienterare</h3>
                  <p className="text-sm text-gray-600">
                    Som orienterare förstår vi sportens unika behov och utmaningar. Vi har byggt 
                    denna app med kärlek, kunskap och förståelse för vad som faktiskt behövs i fält.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            {isSuccess ? (
              <Alert className="bg-green-50 border-green-200 mb-4">
                <AlertTitle className="text-green-800">Tack för din feedback!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Ditt meddelande har skickats. Vi uppskattar dina synpunkter och kommer att återkomma till dig om det behövs.
                </AlertDescription>
              </Alert>
            ) : null}
            
            <div>
              <div className="flex items-center mb-4">
                <MessageCircle className="text-primary mr-2" size={24} />
                <h2 className="text-xl font-bold">Vi vill höra från dig!</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                Har du förslag på hur vi kan förbättra appen eller vill du rapportera ett problem? 
                Vi uppskattar all feedback som hjälper oss att göra appen bättre.
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Namn</FormLabel>
                        <FormControl>
                          <Input placeholder="Ditt namn" {...field} />
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
                        <FormLabel>E-post</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Din e-postadress" {...field} />
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
                        <FormLabel>Meddelande</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Skriv ditt meddelande här..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
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
            
            <Separator className="my-6" />
            
            <div className="text-center text-sm text-gray-500">
              <p>Version 1.0.0</p>
              <p>© 2025 Alla rättigheter förbehållna</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default InfoPage;
