import { Command } from 'discord-akairo';
import { Message, MessageEmbed, Util } from 'discord.js';

export default class NowPlayingKPOPCommand extends Command {
	public constructor() {
		super('npk', {
			aliases: ['npk', 'now-playing-kpop', 'nowplayingkpop'],
			description: {
				content: 'Display the currently playing KPOP song.'
			},
			category: 'listen',
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2
		});
	}

	public async exec(message: Message) {
		const { radioInfoKpop } = this.client;
		const name = `**Name**: ${Util.escapeMarkdown(radioInfoKpop.songName)}`;
		const artists = `${radioInfoKpop.artistCount > 1 ? '**Artists**' : '**Artist**'}: ${Util.escapeMarkdown(radioInfoKpop.artistList!)}`;
		const anime = radioInfoKpop.sourceName ? `**Source**: ${Util.escapeMarkdown(radioInfoKpop.sourceName)}` : '';
		const album = radioInfoKpop.albumName ? `**Album**: ${Util.escapeMarkdown(radioInfoKpop.albumName)}` : '';
		const requestedBy = radioInfoKpop.event
			? `🎉 **${Util.escapeMarkdown(radioInfoKpop.eventName!)}** 🎉`
			: radioInfoKpop.requestedBy
			? `Requested by: ${Util.escapeMarkdown(radioInfoKpop.requestedBy)}` // eslint-disable-line max-len
			: '';
		const ifAlbum = radioInfoKpop.albumName ? '\n' : '';
		const ifAnime = radioInfoKpop.sourceName ? '\n' : '';
		const ifRequest = requestedBy ? '\n\n' : '';
		const song = `${name}\n${artists}${ifAlbum}${album}${ifAnime}${anime}${ifRequest}${requestedBy}`;
		const cover = radioInfoKpop.event ? radioInfoKpop.eventCover : radioInfoKpop.albumCover;

		const embed = new MessageEmbed()
			.setColor(3189229)
			.addField('❯ Now playing', song)
			.setThumbnail(cover!);

		return message.util!.send(embed);
	}
}
