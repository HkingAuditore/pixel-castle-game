import React from 'react';
import { Skull } from 'lucide-react';

export const GameOver = ({ round, onRestart }) => {
  return (
    <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center text-white z-50 font-mono">
      <Skull size={80} className="mb-4 text-red-300" />
      <h1 className="text-6xl font-bold mb-4">GAME OVER</h1>
      <p className="text-xl mb-8">SURVIVED: {round} WAVES</p>
      <button 
        onClick={onRestart}
        className="bg-white text-red-900 px-8 py-3 font-bold border-4 border-gray-400 hover:bg-gray-200 shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
      >
        RETRY?
      </button>
    </div>
  );
};

export default GameOver;
