import React from 'react';
import { PixelPlayerCastle, PixelEnemyCastle } from './Castle';
import { GAME_CONFIG } from '../../config/gameConfig';

export const Battlefield = ({ 
  playerCastle, 
  enemyCastle, 
  units, 
  particles, 
  timeLeft,
  gameWidth = GAME_CONFIG.display.width,
  gameHeight = GAME_CONFIG.display.height,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-[#4ade80]">
      {/* Pixel grass texture */}
      <div 
        className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: 'radial-gradient(#15803d 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }}
      />
      
      {/* Decorative elements: pixel trees/rocks */}
      <div className="absolute top-10 left-20">
        <svg width="40" height="40" viewBox="0 0 10 10">
          <rect x="4" y="6" width="2" height="4" fill="#78350f"/>
          <rect x="2" y="1" width="6" height="6" fill="#166534"/>
        </svg>
      </div>
      <div className="absolute bottom-40 right-40">
        <svg width="30" height="30" viewBox="0 0 10 10">
          <rect x="2" y="4" width="6" height="4" fill="#57534e"/>
          <rect x="3" y="3" width="3" height="1" fill="#a8a29e"/>
        </svg>
      </div>
      <div className="absolute top-1/2 left-1/3">
        <svg width="20" height="20" viewBox="0 0 10 10">
          <rect x="4" y="4" width="2" height="2" fill="#86efac"/>
        </svg>
      </div>

      {/* Player Castle */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 w-32 h-32 z-10">
        <PixelPlayerCastle hpPercent={(playerCastle.hp / playerCastle.maxHp) * 100} />
        <div className="text-center mt-2 font-mono font-bold text-blue-900 text-sm bg-white/50 rounded px-1">
          HOME
        </div>
      </div>

      {/* Enemy Castle */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 z-10">
        <PixelEnemyCastle hpPercent={(enemyCastle.hp / enemyCastle.maxHp) * 100} />
        <div className="text-center mt-2 font-mono font-bold text-red-900 text-sm bg-white/50 rounded px-1">
          ENEMY
        </div>
      </div>

      {/* Battle Units */}
      <div className="absolute inset-0 pointer-events-none">
        {units.map(unit => (
          <div 
            key={unit.id}
            className="absolute w-12 h-12 transition-transform duration-100 flex flex-col items-center"
            style={{ 
              left: `${(unit.x / gameWidth) * 100}%`,
              top: `${(unit.y / gameHeight) * 100}%`,
              transform: `translate(-50%, -50%) scaleX(${unit.side === 'player' ? 1 : -1})`,
              zIndex: Math.floor(unit.y)
            }}
          >
            {/* HP Bar */}
            <div className="w-8 h-1 bg-black/50 mb-1">
              <div 
                className={`h-full ${unit.side === 'player' ? 'bg-green-400' : 'bg-red-500'}`} 
                style={{ width: `${Math.max(0, (unit.hp / unit.maxHp) * 100)}%` }}
              />
            </div>
            {/* Unit SVG */}
            {unit.svg}
          </div>
        ))}
      </div>

      {/* Damage Numbers */}
      {particles.map(p => (
        <div 
          key={p.id}
          className={`absolute font-mono font-bold text-lg animate-bounce ${p.color} z-50`}
          style={{ 
            left: `${(p.x / gameWidth) * 100}%`,
            top: `${(p.y / gameHeight) * 100}%`,
            transform: 'translate(-50%, -100%)',
            textShadow: '1px 1px 0 #000'
          }}
        >
          {p.text}
        </div>
      ))}

      {/* Round Timer */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-1 rounded border-2 border-slate-600 flex items-center gap-2 font-mono text-xl shadow-lg z-30">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-yellow-400">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span className={timeLeft <= 10 ? 'text-red-400' : ''}>{timeLeft}</span>
      </div>
    </div>
  );
};

export default Battlefield;
