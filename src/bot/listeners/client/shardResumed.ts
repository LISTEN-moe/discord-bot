import { Listener } from 'discord-akairo';

export default class ShardResumeListener extends Listener {
	public constructor() {
		super('shardResumed', {
			emitter: 'client',
			event: 'shardResumed',
			category: 'client',
		});
	}

	public exec(id: number) {
		this.client.logger.info(`[SHARD ${id} RESUMED]`);
	}
}
