const { ShardingManager } = require('discord.js');
const { TOKEN } = process.env;
const manager = new ShardingManager('./src/Listen.js', { totalShards: 'auto', token: TOKEN });

manager.spawn();
