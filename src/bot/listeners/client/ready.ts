import { Listener } from 'discord-akairo';
import { ReferenceType } from 'rejects';

export default class ReadyListener extends Listener {
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			category: 'client'
		});
	}

	public async exec() {
		this.client.logger.info(`[READY] ${this.client.user!.tag} (${this.client.user!.id})`);
		this.client.user!.setActivity(`@${this.client.user!.username} help 🎶`);
	}
}
