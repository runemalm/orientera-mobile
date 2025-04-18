
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';

const HomePage: React.FC = () => {
  return (
    <MobileLayout title="Hem">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Välkommen!</h1>
        <p className="text-gray-600">
          Här kan du hitta orienterings&shy;tävlingar i närheten och hantera din profil.
        </p>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
