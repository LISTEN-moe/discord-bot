const ListenCommand = require('../../command/Command');
const { stripIndents } = require('common-tags');

const RESPONSES = [
	'No.',
	'Not happening.',
	'Maybe later.',
	stripIndents`:ping_pong: Pong! \`$(ping)ms\`
		Heartbeat: \`$(heartbeat)ms\``,
	stripIndents`I-it's not like I wanted to pong! \`$(ping)ms\`
		Doki doki: \`$(heartbeat)ms\``,
	stripIndents`D-don't think this means anything special! \`$(ping)ms\`
		Heartbeat: \`$(heartbeat)ms\``,
	stripIndents`D-don't think this means anything special! \`$(ping)ms\`
		Heartbeat: \`$(heartbeat)ms\``
];

module.exports = class PingCommand extends ListenCommand {
	constructor(client) {
		super(client, {
			name: 'ping',
			aliases: ['pong', 'ping-pong'],
			group: 'util',
			memberName: 'ping',
			description: 'Checks the bot\'s ping to the Discord server.',
			guarded: true,
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(msg) {
		const message = await msg.say('Pinging...');

		return message.edit(RESPONSES[Math.floor(Math.random() * RESPONSES.length)]
			.replace('$(ping)', Math.round(message.createdTimestamp - msg.createdTimestamp))
			.replace('$(heartbeat)', Math.round(this.client.ping))
		);
	}
};
