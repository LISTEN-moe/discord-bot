import { Listener } from 'discord-akairo';

export default class ShardDisconnectedListener extends Listener {
	public constructor() {
		super('shardDisconnected', {
			emitter: 'client',
			event: 'shardDisconnected',
			category: 'client'
		});
	}

	public exec(event: any) {
		this.client.logger.warn(`[DISCONNECT] (${event.code})`, event);
	}
}
