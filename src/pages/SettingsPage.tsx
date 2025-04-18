
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';

const SettingsPage: React.FC = () => {
  return (
    <MobileLayout title="Inställningar">
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Inställningar</h2>
        <div className="text-sm text-gray-500">
          Här kommer det snart finnas inställningar för:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Radie för närliggande tävlingar</li>
            <li>Notifikationer</li>
            <li>Standardklasser</li>
            <li>Och mer...</li>
          </ul>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SettingsPage;
