import { Command } from 'discord-akairo';
import { Message, MessageEmbed, Util } from 'discord.js';

export default class NowPlayingCommand extends Command {
	public constructor() {
		super('np', {
			aliases: ['np', 'now-playing'],
			description: {
				content: 'Display the currently playing song.',
			},
			category: 'listen',
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2,
		});
	}

	public async exec(message: Message) {
		const { radioInfo } = this.client;
		const name = `**Name**: ${Util.escapeMarkdown(radioInfo.songName)}`;
		const artists = `${radioInfo.artistCount > 1 ? '**Artists**' : '**Artist**'}: ${Util.escapeMarkdown(
			radioInfo.artistList ?? '',
		)}`;
		const anime = radioInfo.sourceName ? `**Source**: ${Util.escapeMarkdown(radioInfo.sourceName)}` : '';
		const album = radioInfo.albumName ? `**Album**: ${Util.escapeMarkdown(radioInfo.albumName)}` : '';
		const requestedBy = radioInfo.event
			? `🎉 **${Util.escapeMarkdown(radioInfo.eventName ?? '')}** 🎉`
			: radioInfo.requestedBy
			? `Requested by: ${Util.escapeMarkdown(radioInfo.requestedBy)}`
			: '';
		const ifAlbum = radioInfo.albumName ? '\n' : '';
		const ifAnime = radioInfo.sourceName ? '\n' : '';
		const ifRequest = requestedBy ? '\n\n' : '';
		const song = `${name}\n${artists}${ifAlbum}${album}${ifAnime}${anime}${ifRequest}${requestedBy}`;
		const cover = radioInfo.event ? radioInfo.eventCover : radioInfo.albumCover;

		const embed = new MessageEmbed()
			.setColor(15473237)
			.addField('❯ Now playing', song)
			.setThumbnail(cover ?? '');

		return message.util!.send(embed);
	}
}
