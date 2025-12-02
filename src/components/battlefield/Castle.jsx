import React from 'react';

// Player Castle (Top-down pixel version)
export const PixelPlayerCastle = ({ hpPercent }) => (
  <svg 
    viewBox="0 0 32 32" 
    className="w-full h-full drop-shadow-xl" 
    shapeRendering="crispEdges"
  >
    {/* Foundation */}
    <rect x="2" y="2" width="28" height="28" fill="#1e293b" />
    <rect x="4" y="4" width="24" height="24" fill="#3b82f6" />
    <rect x="6" y="6" width="20" height="20" fill="#60a5fa" />
    
    {/* Towers */}
    <rect x="2" y="2" width="8" height="8" fill="#1d4ed8" />
    <rect x="22" y="2" width="8" height="8" fill="#1d4ed8" />
    <rect x="2" y="22" width="8" height="8" fill="#1d4ed8" />
    <rect x="22" y="22" width="8" height="8" fill="#1d4ed8" />
    
    {/* Central Keep */}
    <rect x="10" y="10" width="12" height="12" fill="#1e3a8a" />
    <rect x="12" y="12" width="8" height="8" fill="#2563eb" />
    
    {/* Flag */}
    <rect x="15" y="14" width="2" height="2" fill="#ffffff" />

    {/* HP Bar */}
    <rect x="0" y="-6" width="32" height="4" fill="#1f2937" />
    <rect x="1" y="-5" width={30 * (hpPercent / 100)} height="2" fill="#22c55e" />
  </svg>
);

// Enemy Castle (Top-down pixel version)
export const PixelEnemyCastle = ({ hpPercent }) => (
  <svg 
    viewBox="0 0 32 32" 
    className="w-full h-full drop-shadow-xl" 
    shapeRendering="crispEdges"
  >
    {/* Foundation */}
    <rect x="2" y="2" width="28" height="28" fill="#3f1313" />
    <rect x="4" y="4" width="24" height="24" fill="#ef4444" />
    <rect x="6" y="6" width="20" height="20" fill="#f87171" />
    
    {/* Spike Defenses */}
    <path d="M0,16 L4,12 L4,20 Z" fill="#7f1d1d" />
    <path d="M32,16 L28,12 L28,20 Z" fill="#7f1d1d" />
    <path d="M16,0 L12,4 L20,4 Z" fill="#7f1d1d" />
    <path d="M16,32 L12,28 L20,28 Z" fill="#7f1d1d" />

    {/* Central Keep - Skull shape abstract */}
    <rect x="10" y="10" width="12" height="10" fill="#7f1d1d" />
    <rect x="11" y="12" width="2" height="2" fill="#000" />
    <rect x="19" y="12" width="2" height="2" fill="#000" />
    <rect x="14" y="17" width="4" height="2" fill="#000" />

    {/* HP Bar */}
    <rect x="0" y="-6" width="32" height="4" fill="#1f2937" />
    <rect x="1" y="-5" width={30 * (hpPercent / 100)} height="2" fill="#ef4444" />
  </svg>
);

export default { PixelPlayerCastle, PixelEnemyCastle };
