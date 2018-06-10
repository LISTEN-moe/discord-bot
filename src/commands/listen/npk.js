const ListenCommand = require('../../command/Command');
const { oneLine } = require('common-tags');
const { Util } = require('discord.js');

module.exports = class NowPlayingKPOPCommand extends ListenCommand {
	constructor(client) {
		super(client, {
			name: 'npk',
			aliases: ['now-playing-kpop'],
			group: 'listen',
			memberName: 'npk',
			description: 'Display the currently playing KPOP song.'
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
		const { radioInfoKpop } = this.client;
		const name = `**Name**: ${Util.escapeMarkdown(radioInfoKpop.songName)}`;
		const artists = `${radioInfoKpop.artistCount > 1 ? '**Artists**' : '**Artist**'}: ${Util.escapeMarkdown(radioInfoKpop.artistList)}`;
		const anime = radioInfoKpop.sourceName ? `**Source**: ${Util.escapeMarkdown(radioInfoKpop.sourceName)}` : '';
		const album = radioInfoKpop.albumName ? `**Album**: ${Util.escapeMarkdown(radioInfoKpop.albumName)}` : '';
		const requestedBy = radioInfoKpop.event
			? `🎉 **${Util.escapeMarkdown(radioInfoKpop.eventName)}** 🎉`
			: radioInfoKpop.requestedBy
			? `Requested by: ${Util.escapeMarkdown(radioInfoKpop.requestedBy)}` // eslint-disable-line max-len
			: '';
		const ifAlbum = radioInfoKpop.albumName ? '\n' : '';
		const ifAnime = radioInfoKpop.sourceName ? '\n' : '';
		const ifRequest = requestedBy ? '\n\n' : '';
		const song = `${name}\n${artists}${ifAlbum}${album}${ifAnime}${anime}${ifRequest}${requestedBy}`;
		const cover = radioInfoKpop.event ? radioInfoKpop.eventCover : radioInfoKpop.albumCover;

		return msg.channel.send({
			embed: {
				color: 3189229,
				thumbnail: { url: cover },
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
