import { Listener } from 'discord-akairo';

export default class CommandErrorListener extends Listener {
	public constructor() {
		super('error', {
			emitter: 'commandHandler',
			event: 'error',
			category: 'commandHandler'
		});
	}

	public exec(error: Error) {
		this.client.logger.error(`[COMMAND ERROR] ${error.message}`, error.stack);
	}
}
