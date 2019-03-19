import { Listener } from 'discord-akairo';

export default class ShardReadyListener extends Listener {
	public constructor() {
		super('shardReady', {
			emitter: 'client',
			event: 'shardReady',
			category: 'client'
		});
	}

	public exec() {
		this.client.logger.info(`[SHARD READY] ${this.client.user!.tag} (${this.client.user!.id})`);
	}
}
