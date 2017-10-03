const { Command } = require('discord.js-commando');

class ListenCommand extends Command {
	async react(msg, { str = '', success = true }) {
		if (msg.guild && !msg.channel.permissionsFor(this.client.user).has('ADD_REACTIONS')) {
			if (!str) return null;
			return msg.reply(str);
		}
		await msg.react(success ? '353893835572772875' : '353893856988758016');

		return null;
	}
}

module.exports = ListenCommand;
