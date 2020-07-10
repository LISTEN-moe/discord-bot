import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { formatRadioInfoKpop } from '../../../util/formatRadioInfo';

export default class NowPlayingKPOPCommand extends Command {
	public constructor() {
		super('npk', {
			aliases: ['npk', 'now-playing-kpop'],
			description: {
				content: 'Display the currently playing KPOP song.',
			},
			category: 'listen',
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2,
		});
	}

	public async exec(message: Message) {
		const embed = formatRadioInfoKpop(this.client.radioInfoKpop);

		return message.util!.send(embed);
	}
}
