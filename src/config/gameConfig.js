// Game Configuration - Centralized settings for easy maintenance
export const GAME_CONFIG = {
  // Display settings
  display: {
    width: 1200,
    height: 600,
    fps: 30,
    aspectRatio: '16:9',
    minWidth: 800,
    minHeight: 450,
  },

  // Game mechanics
  mechanics: {
    roundDuration: 60,
    initialGold: 100,
    initialFood: 100,
    baseResourceGain: {
      gold: 5,
      food: 8,
    },
    economyLevelBonus: 2,
  },

  // Castle settings
  castle: {
    player: {
      initialHp: 1000,
      position: { x: 80, yCenter: true },
      size: 32,
    },
    enemy: {
      initialHp: 1000,
      position: { x: 1120, yCenter: true },
      size: 32,
      hpScaling: 0.3, // HP increase per round
    },
  },

  // Spawn settings
  spawn: {
    player: {
      x: 120,
      yRange: { min: 150, max: 450 },
    },
    enemy: {
      x: 1080,
      yRange: { min: 150, max: 450 },
      baseInterval: 4000,
      intervalReduction: 300, // per round
      minInterval: 1000,
    },
  },

  // Difficulty scaling
  difficulty: {
    enemyHpMultiplier: 0.25, // per round
    enemyDamageMultiplier: 0.25, // per round
    roundReward: {
      baseGold: 300,
      baseFood: 300,
      perRoundBonus: 50,
    },
  },

  // Upgrade costs
  upgrades: {
    baseCost: 200,
    costMultiplier: 1.5,
    effects: {
      unitPower: 0.5,
      economy: 0.5,
      castle: 0.5,
    },
  },

  // Responsive breakpoints
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  },
};

// Unit type definitions
export const UNIT_TYPES = {
  militia: {
    id: 'militia',
    name: '民兵',
    type: 'melee',
    cost: { gold: 10, food: 20 },
    stats: {
      hp: 50,
      damage: 8,
      range: 40,
      speed: 2.5,
      cooldown: 1000,
    },
    visual: {
      colorPrimary: '#3b82f6',
      colorSecondary: '#1e3a8a',
      icon: 'sword',
    },
  },
  archer: {
    id: 'archer',
    name: '弓箭手',
    type: 'ranged',
    cost: { gold: 25, food: 10 },
    stats: {
      hp: 30,
      damage: 6,
      range: 250,
      speed: 2,
      cooldown: 1500,
    },
    visual: {
      colorPrimary: '#22c55e',
      colorSecondary: '#14532d',
      icon: 'crosshair',
    },
  },
  knight: {
    id: 'knight',
    name: '骑士',
    type: 'heavy',
    cost: { gold: 50, food: 50 },
    stats: {
      hp: 120,
      damage: 15,
      range: 40,
      speed: 3.5,
      cooldown: 1200,
    },
    visual: {
      colorPrimary: '#eab308',
      colorSecondary: '#713f12',
      icon: 'shield',
    },
  },
};

// Enemy type definitions
export const ENEMY_TYPES = {
  goblin: {
    id: 'goblin',
    name: '哥布林',
    type: 'melee',
    stats: {
      hp: 40,
      damage: 5,
      range: 40,
      speed: 3,
      cooldown: 1200,
    },
    visual: {
      colorPrimary: '#ef4444',
      colorSecondary: '#7f1d1d',
    },
  },
  orc: {
    id: 'orc',
    name: '兽人',
    type: 'heavy',
    stats: {
      hp: 80,
      damage: 10,
      range: 40,
      speed: 2,
      cooldown: 1500,
    },
    visual: {
      colorPrimary: '#b91c1c',
      colorSecondary: '#450a0a',
    },
  },
  skeleton_archer: {
    id: 'skeleton_archer',
    name: '骷髅弓手',
    type: 'ranged',
    stats: {
      hp: 30,
      damage: 8,
      range: 220,
      speed: 2,
      cooldown: 1800,
    },
    visual: {
      colorPrimary: '#a855f7',
      colorSecondary: '#581c87',
    },
  },
};

export default GAME_CONFIG;
