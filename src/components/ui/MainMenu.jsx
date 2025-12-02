import React from 'react';
import { PixelPlayerCastle } from '../battlefield/Castle';

export const MainMenu = ({ onStartGame }) => {
  return (
    <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-white z-50 font-mono">
      <div className="mb-8 transform scale-150">
        <PixelPlayerCastle hpPercent={100} />
      </div>
      <h1 className="text-5xl font-bold mb-2 text-yellow-400 tracking-widest">
        PIXEL CASTLE
      </h1>
      <p className="text-slate-400 mb-8 text-sm uppercase tracking-wide">
        Defense Strategy Game
      </p>
      
      <button 
        onClick={onStartGame}
        className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 text-xl font-bold border-4 border-blue-800 shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
      >
        START GAME
      </button>
      
      <div className="absolute bottom-8 text-xs text-slate-600">
        PRESS START TO PLAY
      </div>
    </div>
  );
};

export default MainMenu;
