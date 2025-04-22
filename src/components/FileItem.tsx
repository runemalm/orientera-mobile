import React from 'react';
import { Resource, ResourceType, ResourceFormat } from '../types';
import { 
  FileText, 
  FileSpreadsheet, 
  Clock, 
  Link as LinkIcon, 
  ExternalLink, 
  FileIcon,
  Image,
  Download,
  FileVideo,
  FileAudio,
  FileArchive,
  FileJson
} from 'lucide-react';

interface FileItemProps {
  file: Resource;
  className?: string;
}

const FileItem: React.FC<FileItemProps> = ({ file, className }) => {
  // Translate file types to Swedish
  const getFileTypeName = (type: ResourceType) => {
    switch (type) {
      case ResourceType.Results: return 'Resultat';
      case ResourceType.StartList: return 'Startlista';
      case ResourceType.EntryList: return 'Anmälningslista';
      case ResourceType.Splits: return 'Sträcktider';
      case ResourceType.Invitation: return 'Inbjudan';
      case ResourceType.PM: return 'PM';
      case ResourceType.LiveResults: return 'Liveresultat';
      case ResourceType.MapSample: return 'Kartprov';
      case ResourceType.PressResults: return 'Pressresultat';
      case ResourceType.Livelox: return 'Livelox';
      default: return 'Dokument';
    }
  };

  const getFileIcon = () => {
    // First determine by format
    switch (file.format) {
      case ResourceFormat.Link:
        return <ExternalLink className="text-blue-500" size={20} />;
      case ResourceFormat.Pdf:
        return <FileIcon className="text-red-500" size={20} />;
      case ResourceFormat.Png:
      case ResourceFormat.Jpeg:
      case ResourceFormat.Gif:
        return <Image className="text-purple-500" size={20} />;
      case ResourceFormat.Other:
        return <Clock className="text-gray-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  return (
    <a 
      href={file.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`block ${className}`}
    >
      <div className="flex items-center p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
        <div className="mr-3 flex-shrink-0">{getFileIcon()}</div>
        <div className="flex-grow min-w-0">
          <div className="font-medium truncate">{file.name}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <span className="capitalize">{getFileTypeName(file.type)}</span> 
            <span className="block w-1 h-1 rounded-full bg-gray-300"></span> 
            <span>{new Date(file.uploadDate).toLocaleDateString('sv-SE')}</span>
          </div>
        </div>
        <div className="text-primary ml-2 flex-shrink-0">
          <Download size={18} />
        </div>
      </div>
    </a>
  );
};

export default FileItem;
