
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';

const SettingsPage: React.FC = () => {
  return (
    <MobileLayout title="Inställningar">
      <div className="p-4 space-y-4">
        <p className="text-gray-500">Inga inställningar tillgängliga ännu.</p>
      </div>
    </MobileLayout>
  );
};

export default SettingsPage;
