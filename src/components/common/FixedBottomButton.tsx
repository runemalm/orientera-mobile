
import React, { ReactNode } from 'react';

interface FixedBottomButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

const FixedBottomButton: React.FC<FixedBottomButtonProps> = ({ 
  children, 
  onClick, 
  className = '' 
}) => {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 p-4 bg-gray-50 z-50" // Increased z-index to ensure visibility
      style={{ 
        paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))'
      }}
    >
      <button 
        onClick={onClick}
        className={`w-full py-3 px-4 rounded-md shadow-sm ${className}`} // Added shadow and increased padding
      >
        {children}
      </button>
    </div>
  );
};

export default FixedBottomButton;
