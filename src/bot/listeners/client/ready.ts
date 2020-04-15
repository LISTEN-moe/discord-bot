import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			category: 'client',
		});
	}

	public exec() {
		this.client.logger.info(`[READY] ${this.client.user!.tag} (${this.client.user!.id})`);
		this.client.webSocketManager.connect();
		this.client.webSocketManagerKpop.connect();
	}
}
