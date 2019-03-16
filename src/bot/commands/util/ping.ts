import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';

const RESPONSES: string[] = [
	'No.',
	'Not happening.',
	'Maybe later.',
	stripIndents`:ping_pong: Pong! \`$(ping)ms\`
		Heartbeat: \`$(heartbeat)ms\``,
	stripIndents`Firepower--full force!! \`$(ping)ms\`
		Doki doki: \`$(heartbeat)ms\``,
	stripIndents`A fierce battle makes me want to eat a bucket full of rice afterwards. \`$(ping)ms\`
		Heartbeat: \`$(heartbeat)ms\``,
	stripIndents`This, this is a little embarrassing... \`$(ping)ms\`
		Heartbeat: \`$(heartbeat)ms\``
];

export default class PingCommand extends Command {
	public constructor() {
		super('ping', {
			aliases: ['ping'],
			description: {
				content: "Checks the bot's ping to the Discord servers."
			},
			category: 'util',
			ratelimit: 2
		});
	}

	public async exec(message: Message) {
		const msg = await message.util!.send('Pinging...') as Message;

		return message.util!.send(
			RESPONSES[Math.floor(Math.random() * RESPONSES.length)]
				.replace('$(ping)', ((msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)).toString())
				.replace('$(heartbeat)', Math.round(this.client.ws.ping).toString())
		);
	}
}
