import { Listener } from 'discord-akairo';

export default class ReconnectListener extends Listener {
	public constructor() {
		super('reconnecting', {
			emitter: 'client',
			event: 'reconnecting',
			category: 'client'
		});
	}

	public exec() {
		this.client.logger.info('[RECONNECTING]');
	}
}
