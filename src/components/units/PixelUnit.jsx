import React from 'react';

// Pixel helper component
export const Pixel = ({ x, y, color, size = 1 }) => (
  <rect x={x} y={y} width={size} height={size} fill={color} />
);

// Generic pixel unit generator
export const PixelUnit = ({ colorPrimary, colorSecondary, type }) => {
  return (
    <svg 
      viewBox="0 0 16 16" 
      className="w-full h-full drop-shadow-md" 
      shapeRendering="crispEdges"
    >
      {/* Shadow */}
      <rect x="4" y="13" width="8" height="2" fill="rgba(0,0,0,0.3)" />
      
      {/* Body */}
      <rect x="5" y="5" width="6" height="7" fill={colorPrimary} />
      
      {/* Head */}
      <rect x="5" y="2" width="6" height="4" fill="#fca5a5" />
      
      {/* Helmet/Hair */}
      <rect x="5" y="2" width="6" height="2" fill={colorSecondary} />
      
      {/* Weapon/Feature based on type */}
      {type === 'melee' && (
        <path d="M12,6 L15,6 L15,7 L13,7 L13,10 L12,10 Z" fill="#94a3b8" />
      )}
      {type === 'ranged' && (
        <path 
          d="M12,5 L14,5 L14,11 L12,11 M12,8 L14,8" 
          stroke="#78350f" 
          strokeWidth="1" 
          fill="none" 
        />
      )}
      {type === 'heavy' && (
        <rect x="3" y="6" width="4" height="6" fill="#fbbf24" />
      )}
    </svg>
  );
};

export default PixelUnit;
