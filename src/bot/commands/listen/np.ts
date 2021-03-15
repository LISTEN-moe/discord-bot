import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { formatRadioInfo } from '../../../util/formatRadioInfo';

export default class NowPlayingCommand extends Command {
	public constructor() {
		super('np', {
			aliases: ['np', 'now-playing'],
			description: {
				content: 'Display the currently playing song.',
			},
			category: 'listen',
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2,
		});
	}

	public async exec(message: Message) {
		const embed = formatRadioInfo(this.client.radioInfo);

		return message.util!.send(embed);
	}
}
