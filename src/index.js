/**
 * @name spigot-updater
 * @author eartharoid <eartharoid@left4craft.org>
 * @license GNU-GPLv3
 */

require('dotenv').config();
const fs = require('fs');
const { path } = require('./utils/fs');
const { capitalise } = require('./utils');

const config = require('../config/config');

const Logger = require('leekslazylogger');
const log = new Logger({
	name: 'Server updater',
	debug: config.debug,
	logToFile: config.save_logs
});

fs.readdir(path('data/'), (err, items) => {
	let directories = ['temp', 'servers', 'plugins'];
	for (let d of directories) {
		if (!items.includes(d)) {
			fs.mkdirSync(path('data/' + d));
			log.console(`${capitalise(d)} directory not found, creating it for you...`);
		}
	}	
});

const { Client: DiscordClient, Intents } = require('discord.js');
// ✅❌⚠️❗🆕
class Bot extends DiscordClient {
	constructor() {
		super({
			autoReconnect: true,
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS , Intents.FLAGS.GUILD_MESSAGES] 
		});

		this.utils = require('./utils/discord');
		this.utils.init(this);

		Object.assign(this, {
			config: Object.assign(config, {
				servers: require('../config/servers'),
				plugins: require('../config/plugins'),
			}),
			db: require('./database')(log),
			Embed: this.utils.Embed,
			log,
			messages: new Map(),
		});

		this.log.info('Connecting to Discord API');

		this.on('ready', async () => {
			this.log.success(`Authenticated as ${this.user.tag}`);

			this.channel = this.channels.cache.get(this.config.channel_id);
			if (!this.channel)
				this.log.warn(`Could not get channel with ID of ${this.config.channel_id} in channels cache`);

			this.channel.send('❗ The bot will not respond to reactions on any messages before this.');

			const Updater = require('./updater');
			const updater = new Updater(this);

			await updater.check();
			await updater.download();
			await updater.run();

			setInterval(() => updater.check(), 86400000); // check every day
			setInterval(() => updater.download(), 3600000); // download every hour
			setInterval(() => updater.run(), 43200000); // run every 12 hours
		});

		this.on('messageReactionAdd', async (r, u) => {
			let m = r.message;
			if (m.partial) m = await m.fetch();

			if (u.id === this.user.id) return;
			if (r.emoji.name !== '✅' || m.channel.id !== this.config.channel_id) return;

			let data = this.messages.get(m.id);
			if (!data) return;

			if (data.server_jar) { // server jar
				data = data.server_jar;
				let jar = await this.db.ServerJars.findOne({
					where: {
						type: data.type,
						version: data.version
					}
				});

				await jar.update({
					approved_version: data.actual_version,
					approved_build: data.build,
					approved_file: data.file,
					approved_checksum: data.checksum,
				});

				this.log.console(`${u.username} approved an update for ${capitalise(data.type)} ${data.version}`);

				await m.reactions.removeAll();

				await m.edit(
					this.utils.createEmbed(m.embeds[0])
					// this.utils.createEmbed()
						.setColor('DARK_GREEN')
						.setTitle(`✅ Update approved for ${capitalise(data.type)} ${data.version}`)
						.setDescription(`Approved by ${u}.\nThis will be updated during the next upload task.`)
				);

			} else { // plugin
				data = data.plugin;
				let jar = await this.db.Plugins.findOne({
					where: {
						name: data.name
					}
				});

				await jar.update({
					approved: data.version,
				});

				this.log.console(`${u.username} approved an update for ${data.name}`);

				await m.reactions.removeAll();

				await m.edit(
					this.utils.createEmbed(m.embeds[0])
					// this.utils.createEmbed()
						.setColor('DARK_GREEN')
						.setTitle(`✅ Update approved for ${data.name}`)
						.setDescription(`Approved by ${u}.\nThis will be updated during the next upload task.`)
				);
			}

			// remove this message form the map, it has been approved
			this.messages.delete(m.id);
		});

		this.login();
	}
}

new Bot();

process.on('unhandledRejection', error => {
	log.warn('An error was not caught');
	if (error instanceof Error) log.warn(`Uncaught ${error.name}: ${error}`);
	log.error(error);
});
