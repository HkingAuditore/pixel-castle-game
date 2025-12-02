import React from 'react';
import { Coins, Wheat } from 'lucide-react';
import { UNIT_TYPES } from '../../config/gameConfig';

export const ControlPanel = ({ resources, round, onSpawnUnit }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full p-2 bg-slate-900 border-t-4 border-slate-700 text-white flex flex-col gap-2 z-40 font-mono">
      {/* Resource Bar */}
      <div className="flex justify-between items-center px-4 bg-slate-800 p-2 rounded border border-slate-600">
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-yellow-400">
            <Coins size={20} /> {Math.floor(resources.gold)}
          </div>
          <div className="flex items-center gap-2 text-orange-400">
            <Wheat size={20} /> {Math.floor(resources.food)}
          </div>
        </div>
        <div className="text-slate-400 text-sm">
          WAVE <span className="text-white font-bold">{round}</span>
        </div>
      </div>

      {/* Unit Spawn Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(UNIT_TYPES).map(([key, unit]) => {
          const canAfford = resources.gold >= unit.cost.gold && resources.food >= unit.cost.food;
          
          return (
            <button
              key={key}
              onClick={() => onSpawnUnit(key)}
              disabled={!canAfford}
              className={`
                relative flex items-center p-2 rounded border-2 transition-all active:translate-y-1
                ${canAfford 
                  ? 'bg-slate-700 border-slate-500 hover:bg-slate-600 cursor-pointer' 
                  : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed grayscale'}
              `}
            >
              <div className="w-8 h-8 mr-3">
                {/* Unit icon placeholder - will be replaced with actual SVG */}
                <div className="w-full h-full bg-slate-600 rounded" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-xs">{unit.name}</div>
                <div className="flex gap-2 text-[10px] mt-1 text-slate-300">
                  <span className="flex items-center gap-0.5 text-yellow-500">
                    <Coins size={10}/>{unit.cost.gold}
                  </span>
                  <span className="flex items-center gap-0.5 text-orange-500">
                    <Wheat size={10}/>{unit.cost.food}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ControlPanel;
