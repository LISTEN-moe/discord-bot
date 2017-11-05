const { FriendlyError } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const path = require('path');

const {
	OWNERS,
	COMMAND_PREFIX,
	DISCORD_SERVER_INVITE,
	DISCORD_WEBHOOK_ID,
	DISCORD_WEBHOOK_TOKEN,
	RADIO_CHANNELS,
	WEBSOCKET
} = require(`./util/constants.${process.env.NODE_ENV || 'development'}`);
const ListenClient = require('./client/ListenClient');

const client = new ListenClient({
	owner: OWNERS ? OWNERS.split(',') : '',
	commandPrefix: COMMAND_PREFIX,
	unknownCommandResponse: false,
	invite: DISCORD_SERVER_INVITE,
	webhookID: DISCORD_WEBHOOK_ID,
	webhookToken: DISCORD_WEBHOOK_TOKEN,
	websocket: WEBSOCKET,
	messageCacheMaxSize: 100,
	messageCacheLifeTime: 30,
	messageSweepInterval: 30,
	disableEveryone: true,
	disabledEvents: ['TYPING_START']
});


client.on('error', err => client.logger.error(oneLine`
		[DISCORD]
		${client.shard ? `[SHARD: ${client.shard.id}]` : ''}
		[ERROR]: Error:\n${err.stack}
	`))
	.on('warn', warn =>
		client.logger.warn(oneLine`
			[DISCORD]
			${client.shard ? `[SHARD: ${client.shard.id}]` : ''}
			[WARN]: Warning:\n${warn}
		`)
	)
	.on('ready', () => {
		client.logger.info(oneLine`
			[DISCORD]
			${client.shard ? `[SHARD: ${client.shard.id}]` : ''}
			[READY]: Client ready! Logged in as ${client.user.tag} (${client.user.id})
		`);
	})
	.once('ready', async () => {
		client.websocketManager.connect();
		for (const channel of RADIO_CHANNELS.split(',')) {
			if (!client.channels.has(channel)) continue;
			const voiceChannel = client.channels.get(channel);
			await client.voiceManager.joinVoice(voiceChannel); // eslint-disable-line no-await-in-loop
		}
	})
	.on('disconnect', event =>
		client.logger.warn(oneLine`
			[DISCORD]
			${client.shard ? `[SHARD: ${client.shard.id}]` : ''}
			[DISCONNECT]: Disconnected with code ${event.code}.
		`)
	)
	.on('reconnecting', () =>
		client.logger.warn(oneLine`
			[DISCORD]
			${client.shard ? `[SHARD: ${client.shard.id}]` : ''}
			[RECONNECTING]: Reconnecting...
		`)
	)
	.on('resumed', events =>
		client.logger.info(oneLine`
			[DISCORD]
			${client.shard ? `[SHARD: ${client.shard.id}]` : ''}
			[RESUMED]: Resumed, replayed ${events} events.
		`)
	)
	.on('commandRun', (cmd, promise, msg, args) => {
		client.logger.info(oneLine`
			[DISCORD]
			${client.shard ? `[SHARD: ${client.shard.id}]` : ''}
			[COMMAND]: ${msg.author.tag} (${msg.author.id})
			> ${msg.guild ? `${msg.guild.name} (${msg.guild.id})` : 'DM'}
			>> ${cmd.groupID}:${cmd.memberName}
			${Object.values(args).length ? `>>> ${Object.values(args)}` : ''}
		`);
	})
	.on('commandError', (cmd, err) => {
		client.logger.error(err);
		if (err instanceof FriendlyError) return;
		client.logger.error(oneLine`
			[DISCORD]
			${client.shard ? `[SHARD: ${client.shard.id}]` : ''}
			[COMMAND_ERR]: Error in command ${cmd.groupID}:${cmd.memberName}
		`, err.stack);
	})
	.on('commandBlocked', (msg, reason) =>
		client.logger.info(oneLine`
			[DISCORD]
			${client.shard ? `[SHARD: ${client.shard.id}]` : ''}
			[COMMAND_BLOCK]:
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; User ${msg.author.tag} (${msg.author.id}): ${reason}
		`)
	)
	.on('commandPrefixChange', (guild, prefix) =>
		client.logger.info(oneLine`
			[DISCORD]
			${client.shard ? `[SHARD: ${client.shard.id}]` : ''}
			[PREFIX]: Prefix changed to ${prefix || 'the default'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`)
	)
	.on('commandStatusChange', (guild, command, enabled) =>
		client.logger.info(oneLine`
			[DISCORD]
			${client.shard ? `[SHARD: ${client.shard.id}]` : ''}
			[COMMAND_STATUS]: Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`)
	)
	.on('groupStatusChange', (guild, group, enabled) =>
		client.logger.info(oneLine`
			[DISCORD]
			${client.shard ? `[SHARD: ${client.shard.id}]` : ''}
			[GROUP_STATUS]: Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`)
	);

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['blacklist', 'Blacklist'],
		['listen', 'Listen.moe']
	])
	.registerDefaultGroups()
	.registerDefaultCommands({ ping: false, help: false })
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login();

process.on('unhandledRejection', err => client.logger.error(oneLine`
	[TOHRU]
	${client.shard ? `[SHARD: ${client.shard.id}]` : ''}
	[PROMISE_ERR] Uncaught Promise Error:\n${err.stack}
`));
