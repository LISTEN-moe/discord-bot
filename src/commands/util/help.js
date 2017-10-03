const ListenCommand = require('../../command/Command');
const { MessageEmbed } = require('discord.js');
const { disambiguation } = require('discord.js-commando');
const { stripIndents, oneLine } = require('common-tags');

module.exports = class HelpCommand extends ListenCommand {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'util',
			memberName: 'help',
			aliases: ['commands'],
			description: 'Displays a list of available commands, or detailed information for a specified command.',
			details: oneLine`
				The command may be part of a command name or a whole command name.
				If it isn't specified, all available commands will be listed.
			`,
			examples: ['help', 'help prefix'],
			clientPermissions: ['EMBED_LINKS'],
			guarded: true,

			args: [
				{
					key: 'command',
					prompt: 'which command would you like to view the help for?\n',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, args) { // eslint-disable-line complexity
		const { groups } = this.client.registry;
		const commands = this.client.registry.findCommands(args.command, false, msg);
		const showAll = args.command && args.command.toLowerCase() === 'all';
		if (args.command && !showAll) {
			if (commands.length === 1) {
				const embed = new MessageEmbed()
					.setColor()
					.setTitle(oneLine`
						Command ${commands[0].name}
						${commands[0].guildOnly ? ' (Usable only in servers):' : ':'}
					`)
					.setDescription(stripIndents`
						${commands[0].description}
						
						${commands[0].details ? commands[0].details : ''}
					`)
					.addField('❯ Group',
						oneLine`
						${commands[0].group.name}
						(\`${commands[0].groupID}:${commands[0].memberName}\`)
					`)
					.addField('❯ Format',
						`${msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
					`);
				if (commands[0].aliases.length > 0) embed.addField('❯ Aliases', commands[0].aliases.join(', '));
				if (commands[0].examples) embed.addField('❯ Examples', commands[0].examples.map(ex => `\`${ex}\``).join('\n'));

				return msg.say(embed);
			} else if (commands.length > 1) {
				return msg.reply(disambiguation(commands, 'commands'));
			} else {
				return msg.reply(
					`Unable to identify command. Use ${msg.usage(
						null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
					)} to view the list of all commands.`
				);
			}
		} else {
			const messages = [];
			try {
				/* eslint-disable indent */
				messages.push(await msg.direct(stripIndents`
					${oneLine`
						To run a command in ${msg.guild || 'any server'},
						use ${ListenCommand.usage('command', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
						For example, ${ListenCommand.usage('prefix', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
					`}
					To run a command in this DM, simply use ${ListenCommand.usage('command', null, null)} with no prefix.

					Use ${this.usage('<command>', null, null)} to view detailed information about a specific command.
					Use ${this.usage('all', null, null)} to view a list of *all* commands, not just available ones.

					__**${showAll ? 'All commands' : `Available commands in ${msg.guild || 'this DM'}`}**__

					${(showAll ? groups : groups.filter(grp => grp.commands.some(cmd => cmd.isUsable(msg))))
						.map(grp => stripIndents`
							__${grp.name}__
							${(showAll ? grp.commands : grp.commands.filter(cmd => cmd.isUsable(msg)))
								.map(cmd => `**${cmd.name}:** ${cmd.description}`).join('\n')
							}
						`).join('\n\n')
					}
				`, { split: true }));
				/* eslint-enable indent */
				if (msg.channel.type !== 'dm') messages.push(await msg.reply('Sent you a DM with information.'));
			} catch (err) {
				messages.push(await msg.reply('Unable to send you the help DM. You probably have DMs disabled.'));
			}
			return messages;
		}
	}
};
