import React from 'react';
import { Sword as SwordIcon, ArrowUpCircle, Hammer } from 'lucide-react';
import { GAME_CONFIG } from '../../config/gameConfig';

export const Settlement = ({ 
  round, 
  resources, 
  techLevel, 
  onBuyUpgrade, 
  onNextRound 
}) => {
  const upgrades = [
    { 
      id: 'unitPower', 
      icon: <SwordIcon />, 
      title: 'POWER UP', 
      desc: 'ATK/HP +50%', 
      color: 'red', 
      cost: Math.floor(GAME_CONFIG.upgrades.baseCost * techLevel.unitPower * GAME_CONFIG.upgrades.costMultiplier) 
    },
    { 
      id: 'economy', 
      icon: <ArrowUpCircle />, 
      title: 'ECONOMY', 
      desc: 'Resource +20%', 
      color: 'green', 
      cost: Math.floor(GAME_CONFIG.upgrades.baseCost * techLevel.economy * GAME_CONFIG.upgrades.costMultiplier) 
    },
    { 
      id: 'castle', 
      icon: <Hammer />, 
      title: 'FORTIFY', 
      desc: 'Castle HP UP', 
      color: 'blue', 
      cost: Math.floor(GAME_CONFIG.upgrades.baseCost * techLevel.castle * GAME_CONFIG.upgrades.costMultiplier) 
    },
  ];

  return (
    <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-slate-800 text-white w-full max-w-2xl p-6 border-4 border-slate-500 shadow-[8px_8px_0_0_#000] flex flex-col gap-6">
        <div className="text-center border-b-2 border-slate-600 pb-4">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">VICTORY</h2>
          <p className="text-slate-400 text-sm">WAVE {round} CLEARED</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {upgrades.map(upgrade => {
            const canAfford = resources.gold >= upgrade.cost;
            
            return (
              <button 
                key={upgrade.id}
                onClick={() => onBuyUpgrade(upgrade.id)}
                disabled={!canAfford}
                className={`
                  flex items-center justify-between p-3 border-2 transition-all
                  ${canAfford 
                    ? 'bg-slate-700 border-slate-500 hover:bg-slate-600 hover:border-white cursor-pointer' 
                    : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 border border-slate-600">
                    {upgrade.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-bold">{upgrade.title}</div>
                    <div className="text-xs text-slate-400">
                      {upgrade.desc} (Lv.{techLevel[upgrade.id]})
                    </div>
                  </div>
                </div>
                <div className="text-yellow-400 font-bold text-sm">
                  -{upgrade.cost} G
                </div>
              </button>
            );
          })}
        </div>

        <button 
          onClick={onNextRound}
          className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 border-2 border-yellow-400 shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
        >
          NEXT WAVE &gt;
        </button>
      </div>
    </div>
  );
};

export default Settlement;
