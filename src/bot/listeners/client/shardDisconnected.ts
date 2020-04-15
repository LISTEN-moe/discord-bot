import { Listener } from 'discord-akairo';

export default class ShardDisconnectedListener extends Listener {
	public constructor() {
		super('shardDisconnected', {
			emitter: 'client',
			event: 'shardDisconnected',
			category: 'client',
		});
	}

	public exec(event: any, id: number) {
		this.client.logger.warn(`[SHARD ${id} DISCONNECTED] (${event.code})`, event);
	}
}
