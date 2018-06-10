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
		const name = `**Name**: ${Util.escapeMarkdown(radioInfo.songName)}`;
		const artists = `${radioInfo.artistCount > 1 ? '**Artists**' : '**Artist**'}: ${Util.escapeMarkdown(radioInfo.artistList)}`;
		const anime = radioInfo.sourceName ? `**Source**: ${Util.escapeMarkdown(radioInfo.sourceName)}` : '';
		const album = radioInfo.albumName ? `**Album**: ${Util.escapeMarkdown(radioInfo.albumName)}` : '';
		const requestedBy = radioInfo.event
			? `🎉 **${Util.escapeMarkdown(radioInfo.eventName)}** 🎉`
			: radioInfo.requestedBy
			? `Requested by: ${Util.escapeMarkdown(radioInfo.requestedBy)}` // eslint-disable-line max-len
			: '';
		const ifAlbum = radioInfo.albumName ? '\n' : '';
		const ifAnime = radioInfo.sourceName ? '\n' : '';
		const ifRequest = requestedBy ? '\n\n' : '';
		const song = `${name}\n${artists}${ifAlbum}${album}${ifAnime}${anime}${ifRequest}${requestedBy}`;
		const cover = radioInfo.event ? radioInfo.eventCover : radioInfo.albumCover;

		return msg.channel.send({
			embed: {
				color: 15473237,
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
