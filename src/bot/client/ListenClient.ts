import { join } from 'path';
import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { logger } from '../../util/logger';
import { Logger } from 'winston';
import { Connection } from 'typeorm';
import database from '../structures/Database';
import { Setting } from '../models/Settings';
import TypeORMProvider from '../structures/SettingsProvider';
import WebSocketManager from '../structures/WebSocketManager';
import { RadioInfo, RadioInfoKpop } from '../../types/RadioInfo';

declare module 'discord-akairo' {
	interface AkairoClient {
		logger: Logger;
		db: Connection;
		settings: TypeORMProvider;
		config: ListenOptions;
		radioInfo: RadioInfo;
		radioInfoKpop: RadioInfoKpop;
		webSocketManager: WebSocketManager;
		webSocketManagerKpop: WebSocketManager;
	}
}

interface ListenOptions {
	owner?: string;
	token?: string;
}

export default class ListenClient extends AkairoClient {
	public logger = logger;

	public db!: Connection;

	public settings!: TypeORMProvider;

	public webSocketManager = new WebSocketManager(this, process.env.WEBSOCKET!, 'jpop');

	public webSocketManagerKpop = new WebSocketManager(this, process.env.WEBSOCKET_KPOP!, 'kpop');

	public radioInfo!: RadioInfo;

	public radioInfoKpop!: RadioInfoKpop;

	public commandHandler = new CommandHandler(this, {
		directory: join(__dirname, '..', 'commands'),
		prefix: '~~',
		aliasReplacement: /-/g,
		allowMention: true,
		handleEdits: true,
		commandUtil: true,
		commandUtilLifetime: 3e5,
		defaultCooldown: 3000,
		argumentDefaults: {
			prompt: {
				modifyStart: (_, str) => `${str}\n\nType \`cancel\` to cancel the command.`,
				modifyRetry: (_, str) => `${str}\n\nType \`cancel\` to cancel the command.`,
				timeout: 'Guess you took too long, the command has been cancelled.',
				ended: "More than 3 tries and you still didn't quite get it. The command has been cancelled",
				cancel: 'The command has been cancelled.',
				retries: 3,
				time: 30000,
			},
			otherwise: '',
		},
	});

	public inhibitorHandler = new InhibitorHandler(this, { directory: join(__dirname, '..', 'inhibitors') });

	public listenerHandler = new ListenerHandler(this, { directory: join(__dirname, '..', 'listeners') });

	public config: ListenOptions;

	public constructor(config: ListenOptions) {
		// @ts-ignore
		super(
			{ ownerID: config.owner },
			{
				disableMentions: 'all',
				shards: 'auto',
			},
		);

		this.config = config;

		process.on('unhandledRejection', (err: any) =>
			this.logger.error(`[UNHANDLED REJECTION] ${err.message}`, err.stack),
		);
	}

	private async _init() {
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			inhibitorHandler: this.inhibitorHandler,
			listenerHandler: this.listenerHandler,
		});

		this.commandHandler.loadAll();
		this.inhibitorHandler.loadAll();
		this.listenerHandler.loadAll();

		this.db = database.get('listen');
		await this.db.connect();
		this.settings = new TypeORMProvider(this.db.getRepository(Setting));
		await this.settings.init();
	}

	public async start() {
		await this._init();
		return this.login(this.config.token);
	}
}
