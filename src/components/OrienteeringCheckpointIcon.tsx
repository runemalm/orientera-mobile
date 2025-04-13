
import React from 'react';

interface OrienteeringCheckpointIconProps {
  className?: string;
  size?: number;
}

const OrienteeringCheckpointIcon: React.FC<OrienteeringCheckpointIconProps> = ({ 
  className = "", 
  size = 24 
}) => {
  return (
    <div 
      className={`relative ${className}`} 
      style={{ width: size, height: size }}
    >
      <div 
        className="absolute inset-0 border border-gray-600" 
        style={{ transform: 'rotate(45deg)' }}
      />
      <div 
        className="absolute inset-0" 
        style={{ 
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          backgroundColor: '#F97316', // Bright orange
          transform: 'rotate(45deg)'
        }} 
      />
      <div 
        className="absolute inset-0" 
        style={{ 
          clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
          backgroundColor: 'white',
          transform: 'rotate(45deg)'
        }} 
      />
    </div>
  );
};

export default OrienteeringCheckpointIcon;
