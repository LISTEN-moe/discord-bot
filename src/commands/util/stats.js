const ListenCommand = require('../../command/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const moment = require('moment');
require('moment-duration-format');

const { version } = require('../../../package.json');

module.exports = class StatsCommand extends ListenCommand {
	constructor(client) {
		super(client, {
			name: 'stats',
			aliases: ['statistics'],
			group: 'util',
			memberName: 'stats',
			description: 'Displays statistics about the bot.',
			clientPermissions: ['EMBED_LINKS'],
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	run(msg) {
		const embed = new MessageEmbed()
			.setColor(3447003)
			.setDescription(`**${this.client.user.username} Statistics**`)
			.addField('❯ Uptime', moment.duration(this.client.uptime).format('d[d ]h[h ]m[m ]s[s]'), true)
			.addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
			.addField('❯ General Stats', stripIndents`
				• Guilds: ${this.client.guilds.size}
				• Channels: ${this.client.channels.size}
			`, true)
			.addField('❯ Version', `v${version}`, true)
			.addField('❯ Source Code',
				'[View Here](https://github.com/LISTEN-moe/discord-bot)', true)
			.addField('❯ Library',
				'[discord.js](https://discord.js.org)[-commando](https://github.com/Gawdl3y/discord.js-commando)', true)
			.setThumbnail(this.client.user.displayAvatarURL())
			.setFooter('© 2017 Crawl#2424');

		return msg.say(embed);
	}
};
