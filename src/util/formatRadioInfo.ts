import { RadioInfo, RadioInfoKpop } from '../types/RadioInfo';
import { MessageEmbed, Util } from 'discord.js';

const format = (info: RadioInfo | RadioInfoKpop): { cover?: string; song: string } => {
	const name = `**Name**: ${Util.escapeMarkdown(info.songName)}`;
	const artists = `${info.artistCount > 1 ? '**Artists**' : '**Artist**'}: ${Util.escapeMarkdown(
		info.artistList ?? '',
	)}`;
	const anime = info.sourceName ? `**Source**: ${Util.escapeMarkdown(info.sourceName)}` : '';
	const album = info.albumName ? `**Album**: ${Util.escapeMarkdown(info.albumName)}` : '';
	const requestedBy = info.event
		? `🎉 **${Util.escapeMarkdown(info.eventName ?? '')}** 🎉`
		: info.requestedBy
		? `Requested by: ${Util.escapeMarkdown(info.requestedBy)}`
		: '';
	const ifAlbum = info.albumName ? '\n' : '';
	const ifAnime = info.sourceName ? '\n' : '';
	const ifRequest = requestedBy ? '\n\n' : '';
	const song = `${name}\n${artists}${ifAlbum}${album}${ifAnime}${anime}${ifRequest}${requestedBy}`;
	const cover = info.event ? info.eventCover : info.albumCover;
	return { cover, song };
};

export function formatRadioInfo(info: RadioInfo): MessageEmbed {
	const { song, cover } = format(info);

	return new MessageEmbed()
		.setColor(15473237)
		.addField('❯ Now playing', song)
		.setThumbnail(cover ?? '');
}

export function formatRadioInfoKpop(info: RadioInfoKpop): MessageEmbed {
	const { song, cover } = format(info);

	return new MessageEmbed()
		.setColor(3189229)
		.addField('❯ Now playing', song)
		.setThumbnail(cover ?? '');
}
