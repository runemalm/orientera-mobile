
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Rocket, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ComingSoonPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || 'Denna funktion';

  return (
    <MobileLayout 
      title="Kommer snart" 
      showBackButton={true}
    >
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <Rocket size={64} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Kommer snart!</h2>
        <p className="text-muted-foreground text-center mb-6 px-6">
          {from} är under utveckling och kommer snart.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 text-primary"
        >
          <ArrowLeft size={16} />
          <span>Gå tillbaka</span>
        </button>
      </div>
    </MobileLayout>
  );
};

export default ComingSoonPage;
