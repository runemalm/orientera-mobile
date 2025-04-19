import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MobileLayout from '../components/layout/MobileLayout';
import FileItem from '../components/FileItem';
import { mockCompetitionDetails } from '../utils/mockData';
import { Resource } from '../types';

const DocumentsPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const [files, setFiles] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [competitionName, setCompetitionName] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (competitionId && mockCompetitionDetails[competitionId]) {
        const competitionData = mockCompetitionDetails[competitionId];
        setFiles(competitionData.resources);
        setCompetitionName(competitionData.name);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [competitionId]);

  if (loading) {
    return (
      <MobileLayout title="Laddar..." showBackButton>
        <div className="flex flex-col justify-center items-center h-64 mt-4 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-500">Hämtar dokument...</p>
        </div>
      </MobileLayout>
    );
  }

  if (!files.length) {
    return (
      <MobileLayout title={`Dokument: ${competitionName}`} showBackButton>
        <div className="flex flex-col items-center justify-center h-64 mt-8 px-4 text-center">
          <div className="bg-gray-100 rounded-full p-4 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <path d="M14 2v6h6"></path>
              <path d="M16 13H8"></path>
              <path d="M16 17H8"></path>
              <path d="M10 9H8"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold">Inga dokument tillgängliga</h2>
          <p className="text-gray-500 mt-2">Det finns inga dokument för denna tävling ännu.</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title={`Dokument: ${competitionName}`} showBackButton>
      <div className="pb-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-4">
          <h2 className="text-lg font-semibold mb-4">Dokument & länkar</h2>
          <div className="space-y-2">
            {files.map((file) => (
              <FileItem key={file.id} file={file} />
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DocumentsPage;
