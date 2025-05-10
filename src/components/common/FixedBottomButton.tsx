
import React, { ReactNode, useRef, useEffect } from 'react';

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Reset button state on unmount to prevent stuck states
  useEffect(() => {
    return () => {
      if (buttonRef.current) {
        buttonRef.current.blur();
      }
    };
  }, []);
  
  // Enhanced click handler to ensure proper state reset
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick();
    
    // Force blur after click
    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.blur();
      }
    }, 50);
  };
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200 z-10"
      style={{ 
        paddingBottom: 'calc(1rem + var(--safe-area-inset-bottom, 0px))'
      }}
    >
      <button 
        onClick={handleClick}
        className={`w-full py-2 px-4 rounded-md ${className}`}
        ref={buttonRef}
        data-touch-button="true"
      >
        {children}
      </button>
    </div>
  );
};

export default FixedBottomButton;
