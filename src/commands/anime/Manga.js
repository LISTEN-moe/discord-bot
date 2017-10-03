const ListenCommand = require('../../command/Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndents } = require('common-tags');
const moment = require('moment');
const Kitsu = require('kitsu.js');
const kitsu = new Kitsu();

module.exports = class MangaCommand extends ListenCommand {
	constructor(client) {
		super(client, {
			name: 'manga',
			aliases: ['mango'],
			group: 'anime',
			memberName: 'manga',
			description: 'Search for an manga.',
			clientPermissions: ['EMBED_LINKS'],
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'manga',
					prompt: 'what manga would you like information on?\n',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { manga }) {
		try {
			var response = await kitsu.searchManga(manga);
		} catch (error) {
			return this.react(msg, { str: 'couldn\'t find an manga with the supplied name.', success: false });
		}
		const resp = response[0];
		const embed = new MessageEmbed()
			.setColor(3447003)
			.setAuthor(
				`${resp.titles.canonical} | ${resp.titles.japanese}`,
				resp.posterImage.original,
				resp.url
			)
			.addField('❯ Type', stripIndents`
					• ${resp.subType.toUpperCase()} ${resp.ageRating ? `(${resp.ageRating})` : ''}
			`, true)
			/* eslint-disable indent */
			.addField('❯ Chapter Count', stripIndents`
				• ${resp.chapterCount
					? resp.chapterCount
					: '?'} / ${resp.volumeCount
						? `${resp.volumeCount}`
						: '?'}
			`, true)
			/* eslint-enable indent */
			.addField('❯ Rating', stripIndents`
				• ${resp.averageRating ? (resp.averageRating / 10).toFixed(2) : 'No rating available'}
			`, true)
			.addField('❯ Serialization', stripIndents`
				• ${resp.serialization ? resp.serialization : 'No info available'}
			`, true)
			.addField('❯ Description', stripIndents`
				${resp.synopsis ? `${resp.synopsis.substring(0, 500)}...` : 'No description available'}
			`)
			.setThumbnail(resp.posterImage.original)
			.setImage(resp.coverImage ? resp.coverImage.original : '')
			.setFooter(oneLine`
				Start Date: ${moment.utc(resp.startDate).format('dddd, MMMM Do YYYY')}
				${resp.endDate ? `| End Date: ${moment.utc(resp.endDate).format('dddd, MMMM Do YYYY')}` : ''}
			`);

		if (!msg.channel.permissionsFor(msg.guild.me).has('ADD_REACTIONS')
			|| !msg.channel.permissionsFor(msg.guild.me).has('MANAGE_MESSAGES')
		) return msg.say(embed);
		msg.react('353893835572772875');
		const message = await msg.say(embed);
		await message.react('🗑');
		try {
			var react = await message.awaitReactions(
				(reaction, user) => reaction.emoji.name === '🗑' && user.id === msg.author.id,
				{ max: 1, time: 10000, errors: ['time'] }
			);
		} catch (error) {
			message.clearReactions();

			return message;
		}
		react.first().message.delete();

		return message;
	}
};
