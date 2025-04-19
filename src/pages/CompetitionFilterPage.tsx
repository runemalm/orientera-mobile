
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CompetitionFilterPage = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout 
      title="Filter"
      action={
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      }
    >
      <div className="p-4">
        {/* Filter content will be added later */}
      </div>
    </MobileLayout>
  );
};

export default CompetitionFilterPage;
