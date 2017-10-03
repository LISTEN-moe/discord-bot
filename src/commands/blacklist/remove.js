const ListenCommand = require('../../command/Command');

module.exports = class RemoveBlacklistCommand extends ListenCommand {
	constructor(client) {
		super(client, {
			name: 'blacklist-remove',
			aliases: ['remove-blacklist', 'whitelist', 'bl-remove', 'remove-bl'],
			group: 'blacklist',
			memberName: 'remove',
			description: 'Remove a user from the blacklist',
			examples: ['removebl @Crawl#2424', 'removebl Crawl', 'removebl 81440962496172032'],
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'user',
					prompt: 'what user should get removed from the blacklist?\n',
					type: 'user'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	run(msg, { user }) {
		const blacklist = this.client.provider.get('global', 'blacklist', []);
		if (!blacklist.includes(user.id)) {
			return this.react(msg, { str: 'that user is not blacklisted.', success: false });
		}
		const index = blacklist.indexOf(user.id);
		blacklist.splice(index, 1);
		if (blacklist.length === 0) this.client.provider.remove('global', 'blacklist');
		else this.client.provider.set('global', 'blacklist', blacklist);

		return this.react(msg, { str: `${user.tag} has been removed from the blacklist.` });
	}
};
