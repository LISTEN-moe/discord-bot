const ListenCommand = require('../../command/Command');
const { oneLine } = require('common-tags');
const { Util } = require('discord.js');

module.exports = class NowPlayingCommand extends ListenCommand {
	constructor(client) {
		super(client, {
			name: 'np',
			aliases: ['now-playing'],
			group: 'listen',
			memberName: 'np',
			description: 'Display the currently playing song.'
		});
	}

	run(msg) {
		if (msg.channel.type !== 'dm') {
			const permission = msg.channel.permissionsFor(this.client.user);
			if (!permission.has('EMBED_LINKS')) {
				return msg.say(oneLine`
					I don't have permissions to post embeds in this channel,
					if you want me to display the currently playing song, please enable it for me to do so!
				`);
			}
		}
		const { radioInfo } = this.client;
		const nowplaying = `${radioInfo.artistName ? `${radioInfo.artistName} - ` : ''}${radioInfo.songName}`;
		const anime = radioInfo.animeName ? `Source: ${radioInfo.animeName}` : '';
		const requestedBy = radioInfo.requestedBy
			? /\s/g.test(radioInfo.requestedBy)
				? `🎉 **${Util.escapeMarkdown(radioInfo.requestedBy)}** 🎉`
				: `Requested by: ${Util.escapeMarkdown(radioInfo.requestedBy)}` // eslint-disable-line max-len
			: '';
		const ifAnime = radioInfo.animeName ? '\n' : '';
		const song = `${Util.escapeMarkdown(nowplaying)}\n${ifAnime}${Util.escapeMarkdown(anime)}\n${requestedBy}`;

		return msg.channel.send({
			embed: {
				color: 15473237,
				fields: [
					{
						name: 'Now playing',
						value: song
					}
				]
			}
		});
	}
};
