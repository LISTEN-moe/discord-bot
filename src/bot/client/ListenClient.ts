import { join } from 'path';
import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { Logger, createLogger, transports, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { Connection } from 'typeorm';
import database from '../structures/Database';
import { Setting } from '../models/Settings';
import TypeORMProvider from '../structures/SettingsProvider';
import WebSocketManager from '../structures/WebSocketManager';

declare module 'discord-akairo' {
	interface AkairoClient {
		logger: Logger;
		db: Connection;
		settings: TypeORMProvider;
		config: ListenOptions;
		radioInfo: RadioInfo;
		radioInfoKpop: RadioInfoKpop;
	}
}

interface ListenOptions {
	owner?: string;
	token?: string;
}

interface RadioInfo {
	songName: string;
	artistName?: string;
	artistList?: string;
	artistCount: number;
	sourceName: string;
	albumName: string;
	albumCover: string;
	listeners: number;
	requestedBy: string;
	event: boolean;
	eventName?: string;
	eventCover?: string;
}

interface RadioInfoKpop {
	songName: string;
	artistName?: string;
	artistList?: string;
	artistCount: number;
	sourceName: string;
	albumName: string;
	albumCover: string;
	listeners: number;
	requestedBy: string;
	event: boolean;
	eventName?: string;
	eventCover?: string;
}

export default class ListenClient extends AkairoClient {
	public logger = createLogger({
		format: format.combine(
			format.colorize({ level: true }),
			format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
			format.printf((info: any) => {
				const { timestamp, level, message, ...rest } = info;
				return `[${timestamp}] ${level}: ${message}${Object.keys(rest).length ? `\n${JSON.stringify(rest, null, 2)}` : ''}`;
			})
		),
		transports: [
			new transports.Console({ level: 'info' }),
			new DailyRotateFile({
				format: format.combine(
					format.timestamp(),
					format.json()
				),
				level: 'debug',
				filename: 'listen-%DATE%.log',
				maxFiles: '14d'
			})
		]
	});

	public db!: Connection;

	public settings!: TypeORMProvider;

	public webSocketManager: WebSocketManager = new WebSocketManager(this, 'asd', 'jpop');

	public webSocketManagerKpop: WebSocketManager = new WebSocketManager(this, 'as', 'kpop');

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
		defaultPrompt: {
			modifyStart: str => `${str}\n\nType \`cancel\` to cancel the command.`,
			modifyRetry: str => `${str}\n\nType \`cancel\` to cancel the command.`,
			timeout: 'Guess you took too long, the command has been cancelled.',
			ended: "More than 3 tries and you still didn't quite get it. The command has been cancelled",
			cancel: 'The command has been cancelled.',
			retries: 3,
			time: 30000
		}
	});
	public inhibitorHandler = new InhibitorHandler(this, { directory: join(__dirname, '..', 'inhibitors') });

	public listenerHandler = new ListenerHandler(this, { directory: join(__dirname, '..', 'listeners') });

	public config: ListenOptions;

	public constructor(config: ListenOptions) {
		// @ts-ignore
		super({ ownerID: config.owner }, {
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
			shardCount: 'auto'
		});

		this.config = config;

		process.on('unhandledRejection', (err: any) => this.logger.error(`[UNHANDLED REJECTION] ${err.message}`, err.stack));
	}

	private async _init() {
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			inhibitorHandler: this.inhibitorHandler,
			listenerHandler: this.listenerHandler
		});

		this.commandHandler.loadAll();
		this.inhibitorHandler.loadAll();
		this.listenerHandler.loadAll();

		this.db = database.get('haruna');
		await this.db.connect();
		this.settings = new TypeORMProvider(this.db.getRepository(Setting));
		await this.settings.init();
	}

	public async start() {
		await this._init();
		return this.login(this.config.token);
	}
}
