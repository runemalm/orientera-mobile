
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
      className="fixed bottom-0 left-0 right-0 p-4 bg-gray-50 z-10"
      style={{ 
        paddingBottom: 'calc(1rem + var(--safe-area-inset-bottom, 0px))'
      }}
    >
      <button 
        onClick={onClick}
        className={`w-full py-2 px-4 rounded-md ${className}`}
      >
        {children}
      </button>
    </div>
  );
};

export default FixedBottomButton;
