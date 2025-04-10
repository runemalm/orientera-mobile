
import React from 'react';
import { CompetitionFile } from '../types';
import { FileText, FileSpreadsheet, FileClock } from 'lucide-react';

interface FileItemProps {
  file: CompetitionFile;
}

const FileItem: React.FC<FileItemProps> = ({ file }) => {
  const getFileIcon = () => {
    switch (file.type) {
      case 'results':
        return <FileSpreadsheet className="text-blue-500" size={20} />;
      case 'startlist':
        return <FileText className="text-green-500" size={20} />;
      case 'splits':
        return <FileSpreadsheet className="text-purple-500" size={20} />;
      case 'invitation':
        return <FileText className="text-amber-500" size={20} />;
      case 'pm':
        return <FileText className="text-red-500" size={20} />;
      default:
        return <FileClock className="text-gray-500" size={20} />;
    }
  };

  return (
    <a href={file.url} target="_blank" rel="noopener noreferrer" className="block">
      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm mb-2 border border-gray-100">
        <div className="mr-3">{getFileIcon()}</div>
        <div className="flex-grow">
          <div className="font-medium">{file.name}</div>
          <div className="text-xs text-gray-500 capitalize">{file.type} • {new Date(file.uploadDate).toLocaleDateString()}</div>
        </div>
        <div className="text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
        </div>
      </div>
    </a>
  );
};

export default FileItem;
