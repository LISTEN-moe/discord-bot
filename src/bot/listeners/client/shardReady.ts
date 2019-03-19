import { Listener } from 'discord-akairo';

export default class ShardReadyListener extends Listener {
	public constructor() {
		super('shardReady', {
			emitter: 'client',
			event: 'shardReady',
			category: 'client'
		});
	}

	public exec(id: number) {
		this.client.logger.info(`[SHARD ${id} READY]`);
	}
}
