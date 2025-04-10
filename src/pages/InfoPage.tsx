
import React, { useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Info, Send, MessageCircle, Heart } from 'lucide-react';
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
                <h3 className="font-semibold text-lg mb-2">Varför skapades appen?</h3>
                <p className="text-gray-700">
                  Denna app utvecklades för att göra det enklare för orienterare att hitta och anmäla 
                  sig till tävlingar. Vi ville skapa en plattform som samlar all information på ett ställe 
                  och gör orienteringssporten mer tillgänglig för både nya och erfarna utövare.
                </p>
              </div>
              
              <div className="flex items-start space-x-3 mt-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Heart className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-medium">Vår vision</h3>
                  <p className="text-sm text-gray-600">
                    Vi strävar efter att göra orientering mer lättillgängligt och 
                    öka antalet aktiva utövare genom att förenkla processen från att hitta till att delta i tävlingar.
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
