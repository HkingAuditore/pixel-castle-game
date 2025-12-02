import React, { useState, useEffect, useRef } from 'react';
import { 
  Coins, 
  Wheat, 
  Zap, 
  Hammer, 
  Clock,
  ArrowUpCircle,
  Play,
  Sword as SwordIcon,
  Crosshair as CrosshairIcon,
  Shield as ShieldIcon,
  Skull
} from 'lucide-react';

// --- 像素风素材组件 (SVG 模拟像素点) ---

// 像素点辅助组件
const Pixel = ({ x, y, color, size = 1 }) => (
  <rect x={x} y={y} width={size} height={size} fill={color} />
);

// 我方城堡 (俯视像素版)
const PixelPlayerCastle = ({ hpPercent }) => (
  <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-xl" shapeRendering="crispEdges">
    {/* 地基 */}
    <rect x="2" y="2" width="28" height="28" fill="#1e293b" />
    <rect x="4" y="4" width="24" height="24" fill="#3b82f6" />
    <rect x="6" y="6" width="20" height="20" fill="#60a5fa" />
    
    {/* 塔楼 */}
    <rect x="2" y="2" width="8" height="8" fill="#1d4ed8" />
    <rect x="22" y="2" width="8" height="8" fill="#1d4ed8" />
    <rect x="2" y="22" width="8" height="8" fill="#1d4ed8" />
    <rect x="22" y="22" width="8" height="8" fill="#1d4ed8" />
    
    {/* 中心主堡 */}
    <rect x="10" y="10" width="12" height="12" fill="#1e3a8a" />
    <rect x="12" y="12" width="8" height="8" fill="#2563eb" />
    
    {/* 旗帜 */}
    <rect x="15" y="14" width="2" height="2" fill="#ffffff" />

    {/* 血条 */}
    <rect x="0" y="-6" width="32" height="4" fill="#1f2937" />
    <rect x="1" y="-5" width={30 * (hpPercent / 100)} height="2" fill="#22c55e" />
  </svg>
);

// 敌方城堡 (俯视像素版)
const PixelEnemyCastle = ({ hpPercent }) => (
  <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-xl" shapeRendering="crispEdges">
    {/* 地基 */}
    <rect x="2" y="2" width="28" height="28" fill="#3f1313" />
    <rect x="4" y="4" width="24" height="24" fill="#ef4444" />
    <rect x="6" y="6" width="20" height="20" fill="#f87171" />
    
    {/* 尖刺防御 */}
    <path d="M0,16 L4,12 L4,20 Z" fill="#7f1d1d" />
    <path d="M32,16 L28,12 L28,20 Z" fill="#7f1d1d" />
    <path d="M16,0 L12,4 L20,4 Z" fill="#7f1d1d" />
    <path d="M16,32 L12,28 L20,28 Z" fill="#7f1d1d" />

    {/* 中心主堡 - 骷髅形状抽象 */}
    <rect x="10" y="10" width="12" height="10" fill="#7f1d1d" />
    <rect x="11" y="12" width="2" height="2" fill="#000" />
    <rect x="19" y="12" width="2" height="2" fill="#000" />
    <rect x="14" y="17" width="4" height="2" fill="#000" />

    {/* 血条 */}
    <rect x="0" y="-6" width="32" height="4" fill="#1f2937" />
    <rect x="1" y="-5" width={30 * (hpPercent / 100)} height="2" fill="#ef4444" />
  </svg>
);

// 通用像素单位生成器
const PixelUnit = ({ colorPrimary, colorSecondary, type }) => {
  return (
    <svg viewBox="0 0 16 16" className="w-full h-full drop-shadow-md" shapeRendering="crispEdges">
      {/* 阴影 */}
      <rect x="4" y="13" width="8" height="2" fill="rgba(0,0,0,0.3)" />
      
      {/* 身体 */}
      <rect x="5" y="5" width="6" height="7" fill={colorPrimary} />
      
      {/* 头部 */}
      <rect x="5" y="2" width="6" height="4" fill="#fca5a5" /> {/* 皮肤色 */}
      {/* 头盔/头发 */}
      <rect x="5" y="2" width="6" height="2" fill={colorSecondary} />
      
      {/* 武器/特征 */}
      {type === 'melee' && (
        <path d="M12,6 L15,6 L15,7 L13,7 L13,10 L12,10 Z" fill="#94a3b8" /> // 剑
      )}
      {type === 'ranged' && (
        <path d="M12,5 L14,5 L14,11 L12,11 M12,8 L14,8" stroke="#78350f" strokeWidth="1" fill="none" /> // 弓
      )}
      {type === 'heavy' && (
        <rect x="3" y="6" width="4" height="6" fill="#fbbf24" /> // 盾牌
      )}
    </svg>
  );
};

// --- 游戏配置与常量 ---
const GAME_WIDTH = 1200; // 战场逻辑宽度
const GAME_HEIGHT = 600; // 战场逻辑高度
const FPS = 30;
const ROUND_DURATION = 60;

// 初始兵种定义
const INITIAL_UNIT_TYPES = {
  militia: {
    id: 'militia', name: '民兵', type: 'melee',
    cost: { gold: 10, food: 20 }, hp: 50, damage: 8, range: 40, speed: 2.5, cooldown: 1000,
    color: 'text-blue-500',
    svg: <PixelUnit colorPrimary="#3b82f6" colorSecondary="#1e3a8a" type="melee" />, 
    icon: <SwordIcon size={16} />
  },
  archer: {
    id: 'archer', name: '弓箭手', type: 'ranged',
    cost: { gold: 25, food: 10 }, hp: 30, damage: 6, range: 250, speed: 2, cooldown: 1500,
    color: 'text-green-600',
    svg: <PixelUnit colorPrimary="#22c55e" colorSecondary="#14532d" type="ranged" />,
    icon: <CrosshairIcon size={16} />
  },
  knight: {
    id: 'knight', name: '骑士', type: 'melee',
    cost: { gold: 50, food: 50 }, hp: 120, damage: 15, range: 40, speed: 3.5, cooldown: 1200,
    color: 'text-yellow-600',
    svg: <PixelUnit colorPrimary="#eab308" colorSecondary="#713f12" type="heavy" />,
    icon: <ShieldIcon size={16} />
  }
};

// 敌方单位配置
const ENEMY_TYPES = {
  goblin: { name: '哥布林', type: 'melee', hp: 40, damage: 5, range: 40, speed: 3, svg: <PixelUnit colorPrimary="#ef4444" colorSecondary="#7f1d1d" type="melee" /> },
  orc: { name: '兽人', type: 'melee', hp: 80, damage: 10, range: 40, speed: 2, svg: <PixelUnit colorPrimary="#b91c1c" colorSecondary="#450a0a" type="heavy" /> },
  skeleton_archer: { name: '骷髅弓手', type: 'ranged', hp: 30, damage: 8, range: 220, speed: 2, svg: <PixelUnit colorPrimary="#a855f7" colorSecondary="#581c87" type="ranged" /> }
};

export default function CastleGame() {
  // --- 状态管理 ---
  const [gameState, setGameState] = useState('MENU');
  const [resources, setResources] = useState({ gold: 100, food: 100 });
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [playerCastle, setPlayerCastle] = useState({ hp: 1000, maxHp: 1000 });
  const [enemyCastle, setEnemyCastle] = useState({ hp: 1000, maxHp: 1000 });
  const [techLevel, setTechLevel] = useState({ unitPower: 1, economy: 1, castle: 1 });
  const [units, setUnits] = useState([]); // 新增 y 坐标
  const [particles, setParticles] = useState([]);

  const gameLoopRef = useRef();
  const resourceLoopRef = useRef();
  const enemySpawnRef = useRef();
  
  // --- 核心游戏循环 ---
  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameLoopRef.current = setInterval(updateGame, 1000 / FPS);
      resourceLoopRef.current = setInterval(() => {
        setResources(prev => ({
          gold: prev.gold + (5 + techLevel.economy * 2),
          food: prev.food + (8 + techLevel.economy * 2)
        }));
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleRoundEnd(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      const spawnRate = Math.max(1000, 4000 - (round * 300));
      enemySpawnRef.current = setInterval(spawnEnemy, spawnRate);
    } else {
      clearInterval(gameLoopRef.current);
      clearInterval(resourceLoopRef.current);
      clearInterval(enemySpawnRef.current);
    }
    return () => {
      clearInterval(gameLoopRef.current);
      clearInterval(resourceLoopRef.current);
      clearInterval(enemySpawnRef.current);
    };
  }, [gameState, round, techLevel]);

  // --- 游戏逻辑更新 ---
  const updateGame = () => {
    const now = Date.now();
    setUnits(prevUnits => {
      // 深度排序：为了产生2.5D效果，y坐标大的（更靠下）应该覆盖y坐标小的
      // 这里我们在渲染时做排序，或者逻辑更新时保持数组
      let nextUnits = prevUnits.map(u => ({ ...u }));
      let newParticles = [];

      nextUnits.forEach(unit => {
        if (unit.hp <= 0) return;

        let target = null;
        let minDist = Infinity;
        const enemies = nextUnits.filter(u => u.side !== unit.side && u.hp > 0);
        
        // 城堡的 Y 坐标取中心范围
        const castleTarget = unit.side === 'player' 
          ? { id: 'enemy_castle', x: GAME_WIDTH - 80, y: GAME_HEIGHT/2, hp: enemyCastle.hp, isCastle: true, radius: 100 }
          : { id: 'player_castle', x: 80, y: GAME_HEIGHT/2, hp: playerCastle.hp, isCastle: true, radius: 100 };

        // 索敌逻辑：寻找距离最近的敌人（考虑 X 和 Y）
        enemies.forEach(enemy => {
          const dx = unit.x - enemy.x;
          const dy = unit.y - enemy.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < minDist) {
            minDist = dist;
            target = enemy;
          }
        });

        // 检查城堡距离
        const dxCastle = unit.x - castleTarget.x;
        const dyCastle = unit.y - castleTarget.y;
        // 简单处理：只看X轴距离接近城堡，或者整体距离
        // 对于像素风Top-down，我们假设城堡是一堵墙或者一个区域
        const distCastle = Math.abs(unit.x - castleTarget.x); // 主要看X轴进攻进度
        if (distCastle < minDist) { // 优先攻击城堡如果它更近（逻辑简化）
           // 这里稍微调整，如果X轴到了就攻击，忽略Y轴的一点偏差
           if (Math.abs(unit.y - castleTarget.y) < 200) { // 只要在中间区域
             minDist = distCastle;
             target = castleTarget;
           }
        }

        if (target && minDist <= unit.range) {
          // 攻击
          if (now - unit.lastAttack > unit.cooldown) {
            unit.lastAttack = now;
            if (target.isCastle) {
              handleCastleDamage(target.id, unit.damage);
            } else {
              target.hp -= unit.damage;
            }
            newParticles.push({
              id: Math.random().toString(36).substr(2, 9),
              x: target.isCastle ? target.x : target.x,
              y: target.isCastle ? target.y : target.y - 20, 
              text: `-${unit.damage}`,
              color: unit.side === 'player' ? 'text-red-400' : 'text-blue-400'
            });
          }
        } else {
          // 移动逻辑
          const direction = unit.side === 'player' ? 1 : -1;
          
          // 如果有目标但不在射程内，向目标移动
          if (target && !target.isCastle) {
             const angle = Math.atan2(target.y - unit.y, target.x - unit.x);
             unit.x += Math.cos(angle) * unit.speed;
             unit.y += Math.sin(angle) * unit.speed;
          } else {
             // 否则向前走，并稍微回归中心Y轴 (简单的群聚行为)
             unit.x += unit.speed * direction;
             
             // 简单的防重叠/随机游走
             if (unit.y < 100) unit.y += 0.5;
             if (unit.y > GAME_HEIGHT - 100) unit.y -= 0.5;
          }
        }
      });

      const survivingUnits = nextUnits.filter(u => u.hp > 0);
      
      // 简单的渲染排序：Y 轴越大越在前面
      survivingUnits.sort((a, b) => a.y - b.y);

      if (newParticles.length > 0) {
        setParticles(prev => [...prev, ...newParticles]);
        setTimeout(() => setParticles(prev => prev.slice(newParticles.length)), 800);
      }

      return survivingUnits;
    });
  };

  const handleCastleDamage = (castleId, damage) => {
    if (castleId === 'enemy_castle') {
      setEnemyCastle(prev => {
        const newHp = prev.hp - damage;
        if (newHp <= 0) handleRoundEnd(true);
        return { ...prev, hp: newHp };
      });
    } else {
      setPlayerCastle(prev => {
        const newHp = prev.hp - damage;
        if (newHp <= 0) handleGameOver();
        return { ...prev, hp: newHp };
      });
    }
  };

  // --- 玩家操作 ---
  const spawnUnit = (typeKey) => {
    const type = INITIAL_UNIT_TYPES[typeKey];
    if (resources.gold >= type.cost.gold && resources.food >= type.cost.food) {
      setResources(prev => ({
        gold: prev.gold - type.cost.gold,
        food: prev.food - type.cost.food
      }));

      // 随机 Y 轴生成位置 (Top-down 特性)
      const randomY = 150 + Math.random() * (GAME_HEIGHT - 300);

      const newUnit = {
        ...type,
        id: Math.random().toString(36).substr(2, 9),
        hp: type.hp * techLevel.unitPower,
        damage: Math.ceil(type.damage * techLevel.unitPower),
        side: 'player',
        x: 120, // 稍微靠前一点
        y: randomY,
        lastAttack: 0
      };
      setUnits(prev => {
        const newArr = [...prev, newUnit];
        newArr.sort((a, b) => a.y - b.y);
        return newArr;
      });
    }
  };

  const spawnEnemy = () => {
    const types = Object.keys(ENEMY_TYPES);
    const randomType = ENEMY_TYPES[types[Math.floor(Math.random() * types.length)]];
    const difficultyMultiplier = 1 + (round * 0.25);
    const randomY = 150 + Math.random() * (GAME_HEIGHT - 300);

    const newUnit = {
      ...randomType,
      id: Math.random().toString(36).substr(2, 9),
      hp: randomType.hp * difficultyMultiplier,
      damage: randomType.damage * difficultyMultiplier,
      side: 'enemy',
      x: GAME_WIDTH - 120,
      y: randomY,
      lastAttack: 0,
      cooldown: 1500 + Math.random() * 500
    };
    setUnits(prev => {
      const newArr = [...prev, newUnit];
      newArr.sort((a, b) => a.y - b.y);
      return newArr;
    });
  };

  // --- 游戏流程控制 ---
  const startGame = () => {
    setGameState('PLAYING');
    setPlayerCastle({ hp: 1000 * techLevel.castle, maxHp: 1000 * techLevel.castle });
    setEnemyCastle({ hp: 1000 * (1 + round * 0.3), maxHp: 1000 * (1 + round * 0.3) });
    setUnits([]);
    setTimeLeft(ROUND_DURATION);
  };

  const handleRoundEnd = (playerWin) => {
    setGameState('SETTLEMENT');
    setResources(prev => ({
      gold: prev.gold + 300 + round * 50,
      food: prev.food + 300 + round * 50
    }));
  };

  const handleGameOver = () => {
    setGameState('GAMEOVER');
  };

  const nextRound = () => {
    setRound(prev => prev + 1);
    startGame();
  };

  const buyUpgrade = (type) => {
    const cost = Math.floor(200 * (techLevel[type] || 1) * 1.5);
    if (resources.gold >= cost) {
      setResources(prev => ({ ...prev, gold: prev.gold - cost }));
      setTechLevel(prev => ({ ...prev, [type]: prev[type] + 0.5 }));
    }
  };

  // --- 渲染组件 ---

  // 1. 像素风战场 (Top-down)
  const renderBattlefield = () => (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-[#4ade80]">
      {/* 像素草地纹理 */}
      <div className="absolute inset-0 opacity-20" 
           style={{ 
             backgroundImage: 'radial-gradient(#15803d 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }}>
      </div>
      
      {/* 装饰性元素：像素树木/石头 (静态 SVG) */}
      <div className="absolute top-10 left-20"><svg width="40" height="40" viewBox="0 0 10 10"><rect x="4" y="6" width="2" height="4" fill="#78350f"/><rect x="2" y="1" width="6" height="6" fill="#166534"/></svg></div>
      <div className="absolute bottom-40 right-40"><svg width="30" height="30" viewBox="0 0 10 10"><rect x="2" y="4" width="6" height="4" fill="#57534e"/><rect x="3" y="3" width="3" height="1" fill="#a8a29e"/></svg></div>
      <div className="absolute top-1/2 left-1/3"><svg width="20" height="20" viewBox="0 0 10 10"><rect x="4" y="4" width="2" height="2" fill="#86efac"/></svg></div>

      {/* 玩家城堡区域 */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 w-32 h-32 z-10">
        <PixelPlayerCastle hpPercent={(playerCastle.hp / playerCastle.maxHp) * 100} />
        <div className="text-center mt-2 font-mono font-bold text-blue-900 text-sm bg-white/50 rounded px-1">HOME</div>
      </div>

      {/* 敌方城堡区域 */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 z-10">
        <PixelEnemyCastle hpPercent={(enemyCastle.hp / enemyCastle.maxHp) * 100} />
        <div className="text-center mt-2 font-mono font-bold text-red-900 text-sm bg-white/50 rounded px-1">ENEMY</div>
      </div>

      {/* 战斗单位 (Top-down 视角) */}
      <div className="absolute inset-0 pointer-events-none">
        {units.map(unit => (
          <div 
            key={unit.id}
            className="absolute w-12 h-12 transition-transform duration-100 flex flex-col items-center"
            style={{ 
              left: `${(unit.x / GAME_WIDTH) * 100}%`,
              top: `${(unit.y / GAME_HEIGHT) * 100}%`,
              transform: `translate(-50%, -50%) scaleX(${unit.side === 'player' ? 1 : -1})`, // 左右翻转
              zIndex: Math.floor(unit.y) // Y轴深度排序
            }}
          >
            {/* 血条 */}
            <div className="w-8 h-1 bg-black/50 mb-1">
              <div className={`h-full ${unit.side === 'player' ? 'bg-green-400' : 'bg-red-500'}`} style={{ width: `${(unit.hp / (unit.side === 'player' ? INITIAL_UNIT_TYPES[Object.keys(INITIAL_UNIT_TYPES).find(k => INITIAL_UNIT_TYPES[k].name === unit.name) || 'militia'].hp * techLevel.unitPower : unit.hp + 50)) * 100}%` }}></div>
            </div>
            {/* 单位SVG */}
            {unit.svg}
          </div>
        ))}
      </div>

      {/* 伤害数字 */}
      {particles.map(p => (
        <div 
          key={p.id}
          className={`absolute font-mono font-bold text-lg animate-bounce ${p.color} z-50`}
          style={{ 
            left: `${(p.x / GAME_WIDTH) * 100}%`,
            top: `${(p.y / GAME_HEIGHT) * 100}%`,
            transform: 'translate(-50%, -100%)',
            textShadow: '1px 1px 0 #000'
          }}
        >
          {p.text}
        </div>
      ))}

      {/* 回合倒计时 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-1 rounded border-2 border-slate-600 flex items-center gap-2 font-mono text-xl shadow-lg z-30">
        <Clock size={20} className="text-yellow-400" /> 
        <span className={timeLeft <= 10 ? 'text-red-400' : ''}>{timeLeft}</span>
      </div>
    </div>
  );

  // 2. 底部控制区 (复古像素风格 HUD)
  const renderControls = () => (
    <div className="absolute bottom-0 left-0 w-full p-2 bg-slate-900 border-t-4 border-slate-700 text-white flex flex-col gap-2 z-40 font-mono">
      {/* 资源栏 */}
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

      {/* 出兵按钮区 */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(INITIAL_UNIT_TYPES).map(([key, unit]) => (
          <button
            key={key}
            onClick={() => spawnUnit(key)}
            disabled={resources.gold < unit.cost.gold || resources.food < unit.cost.food}
            className={`
              relative flex items-center p-2 rounded border-2 transition-all active:translate-y-1
              ${resources.gold >= unit.cost.gold && resources.food >= unit.cost.food 
                ? 'bg-slate-700 border-slate-500 hover:bg-slate-600 cursor-pointer' 
                : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed grayscale'}
            `}
          >
            <div className="w-8 h-8 mr-3">
              {unit.svg}
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-xs">{unit.name}</div>
              <div className="flex gap-2 text-[10px] mt-1 text-slate-300">
                <span className="flex items-center gap-0.5 text-yellow-500"><Coins size={10}/>{unit.cost.gold}</span>
                <span className="flex items-center gap-0.5 text-orange-500"><Wheat size={10}/>{unit.cost.food}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // 3. 结算界面 (复古弹窗)
  const renderSettlement = () => (
    <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-slate-800 text-white w-full max-w-2xl p-6 border-4 border-slate-500 shadow-[8px_8px_0_0_#000] flex flex-col gap-6">
        <div className="text-center border-b-2 border-slate-600 pb-4">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">VICTORY</h2>
          <p className="text-slate-400 text-sm">WAVE {round} CLEARED</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* 升级选项 */}
          {[
            { id: 'unitPower', icon: <SwordIcon />, title: 'POWER UP', desc: 'ATK/HP +50%', color: 'red', cost: Math.floor(200 * techLevel.unitPower * 1.5) },
            { id: 'economy', icon: <ArrowUpCircle />, title: 'ECONOMY', desc: 'Resource +20%', color: 'green', cost: Math.floor(200 * techLevel.economy * 1.5) },
            { id: 'castle', icon: <Hammer />, title: 'FORTIFY', desc: 'Castle HP UP', color: 'blue', cost: Math.floor(200 * techLevel.castle * 1.5) },
          ].map(upgrade => (
            <button 
              key={upgrade.id}
              onClick={() => buyUpgrade(upgrade.id)}
              disabled={resources.gold < upgrade.cost}
              className={`
                flex items-center justify-between p-3 border-2 transition-all
                ${resources.gold >= upgrade.cost 
                  ? 'bg-slate-700 border-slate-500 hover:bg-slate-600 hover:border-white cursor-pointer' 
                  : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-slate-900 border border-slate-600`}>{upgrade.icon}</div>
                <div className="text-left">
                  <div className="font-bold">{upgrade.title}</div>
                  <div className="text-xs text-slate-400">{upgrade.desc} (Lv.{techLevel[upgrade.id]})</div>
                </div>
              </div>
              <div className="text-yellow-400 font-bold text-sm">
                -{upgrade.cost} G
              </div>
            </button>
          ))}
        </div>

        <button 
          onClick={nextRound}
          className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 border-2 border-yellow-400 shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
        >
          NEXT WAVE &gt;
        </button>
      </div>
    </div>
  );

  // 4. 主菜单 (复古像素风)
  const renderMenu = () => (
    <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-white z-50 font-mono">
      <div className="mb-8 transform scale-150">
        <PixelPlayerCastle hpPercent={100} />
      </div>
      <h1 className="text-5xl font-bold mb-2 text-yellow-400 tracking-widest text-shadow-pixel">PIXEL CASTLE</h1>
      <p className="text-slate-400 mb-8 text-sm uppercase tracking-wide">Defense Strategy Game</p>
      
      <button 
        onClick={startGame}
        className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 text-xl font-bold border-4 border-blue-800 shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
      >
        START GAME
      </button>
      
      <div className="absolute bottom-8 text-xs text-slate-600">
        PRESS START TO PLAY
      </div>
    </div>
  );

  // 5. 游戏结束
  const renderGameOver = () => (
    <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center text-white z-50 font-mono">
      <Skull size={80} className="mb-4 text-red-300" />
      <h1 className="text-6xl font-bold mb-4">GAME OVER</h1>
      <p className="text-xl mb-8">SURVIVED: {round} WAVES</p>
      <button 
        onClick={() => window.location.reload()}
        className="bg-white text-red-900 px-8 py-3 font-bold border-4 border-gray-400 hover:bg-gray-200 shadow-[4px_4px_0_0_#000]"
      >
        RETRY?
      </button>
    </div>
  );

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none flex items-center justify-center">
      {/* 游戏容器：固定比例或最大化，保持像素风清晰 */}
      <div className="relative w-full h-full max-w-5xl aspect-video bg-slate-900 shadow-2xl overflow-hidden border-x-8 border-slate-950">
        {/* 1. 战场层 */}
        {renderBattlefield()}

        {/* 2. HUD */}
        {renderControls()}

        {/* 3. 覆盖层 */}
        {gameState !== 'PLAYING' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <div className="pointer-events-auto w-full h-full">
              {gameState === 'MENU' && renderMenu()}
              {gameState === 'GAMEOVER' && renderGameOver()}
              {gameState === 'SETTLEMENT' && renderSettlement()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}