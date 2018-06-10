const { CommandoClient } = require('discord.js-commando');
const { WebhookClient } = require('discord.js');
const Logger = require('../logger/Logger');
const WebsocketManager = require('../websocket/WebsocketManager');
const VoiceManager = require('../voice/VoiceManager');

if (process.env.NODE_ENV === 'production') {
	var Database = require('../data/psql/PostgreSQL');
	var Redis = require('../data/redis/Redis');
} else {
	var Database = require('../data/sqlite/SQLite'); // eslint-disable-line no-redeclare
}

class ListenClient extends CommandoClient {
	constructor(options) {
		super(options);
		this.radioInfo = {};
		this.radioInfoKpop = {};
		this.database = Database ? Database.db : null;
		this.redis = Redis ? Redis.db : null;
		if (options.webhookID && options.webhookToken) {
			this.webhook = new WebhookClient(
				options.webhookID,
				options.webhookToken,
				{ disableEveryone: true }
			);
		}
		this.logger = new Logger();
		this.websocketManager = new WebsocketManager(this, this.options.websocket, 'jpop');
		this.websocketManagerKpop = new WebsocketManager(this, this.options.websocketKpop, 'kpop');
		this.voiceManager = null;

		Database.start();
		playBroadcast(this);

		function playBroadcast(client) {
			const broadcast = client.createVoiceBroadcast();
			broadcast.play('async:https://listen.moe/opus')
				.on('error', err => {
					client.logger.error(err);
					playBroadcast(client);
				})
				.on('end', () => {
					client.logger.error(err);
					playBroadcast(client);
				});
			client.voiceManager = new VoiceManager(client, broadcast);
		}
	}
}

module.exports = ListenClient;
