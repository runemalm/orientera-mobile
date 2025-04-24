
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { MessageSquareCode } from 'lucide-react';

const AssistantPage = () => {
  return (
    <MobileLayout 
      title="Assistent"
      fullHeight
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center space-y-4">
              <MessageSquareCode className="w-12 h-12 mx-auto text-primary" />
              <p>Chatta med AI-assistenten</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t bg-background">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Skriv ett meddelande..."
              className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90">
              Skicka
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default AssistantPage;
