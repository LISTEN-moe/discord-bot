const ListenCommand = require('../../command/Command');

module.exports = class AddBlacklistCommand extends ListenCommand {
	constructor(client) {
		super(client, {
			name: 'blacklist-add',
			aliases: ['add-blacklist', 'blacklist', 'bl-add', 'add-bl'],
			group: 'blacklist',
			memberName: 'add',
			description: 'Prohibit a user from using commando',
			examples: ['blacklist @Crawl#2424', 'blacklist Crawl', 'blacklist 81440962496172032'],
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'user',
					prompt: 'who do you want to blacklist?\n',
					type: 'user'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	run(msg, { user }) {
		if (this.client.isOwner(user.id)) {
			return this.react(msg, { str: 'the bot owner can not be blacklisted.', success: false });
		}
		const blacklist = this.client.provider.get('global', 'blacklist', []);
		if (blacklist.includes(user.id)) {
			return this.react(msg, { str: 'that user is already blacklisted.', success: false });
		}
		blacklist.push(user.id);
		this.client.provider.set('global', 'blacklist', blacklist);

		return this.react(msg, { str: `${user.tag} has been blacklisted from using ${this.client.user}.` });
	}
};
