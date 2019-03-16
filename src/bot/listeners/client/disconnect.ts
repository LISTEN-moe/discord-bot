import { Listener } from 'discord-akairo';

export default class DisconnectListener extends Listener {
	public constructor() {
		super('disconnect', {
			emitter: 'client',
			event: 'disconnect',
			category: 'client'
		});
	}

	public exec(event: any) {
		this.client.logger.warn(`[DISCONNECT] (${event.code})`, event);
	}
}
