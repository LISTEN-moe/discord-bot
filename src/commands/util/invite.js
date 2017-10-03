const ListenCommand = require('../../command/Command');
const { stripIndents } = require('common-tags');

const { DISCORD_BOT_INVITE } = require(`../../util/constants.${process.env.NODE_ENV || 'development'}`);

module.exports = class InviteCommand extends ListenCommand {
	constructor(client) {
		super(client, {
			name: 'invite',
			group: 'util',
			memberName: 'invite',
			description: 'Get an invite for me or an invite to the mansion!',
			guarded: true
		});
	}

	run(msg) {
		return msg.say(stripIndents`
			Add me to your server with:
			<${DISCORD_BOT_INVITE}>

			Or come visit the mansion:
			${this.client.options.invite}
		`);
	}
};
