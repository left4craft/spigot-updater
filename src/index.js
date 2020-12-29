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

const { Client: DiscordClient } = require('discord.js');
// ✅❌⚠️❗🆕
class Bot extends DiscordClient {
	constructor() {
		super({
			autoReconnect: true,
		});
		
		Object.assign(this, {
			config,
			log
		});

		let utils = require('./utils/discord');
		utils.init(this);
		this.Embed = utils.Embed;

		fs.readdir(path('data/'), (err, items) => {
			let directories = ['downloads', 'plugins'],
				// files = ['messages.json', 'plugins.json', 'servers.json'];
				files = {
					messages: {
						file: 'messages.json',
						template: '{}'
					},
					plugins: {
						file: 'plugins.json',
						template: '{}'
					},
					servers: {
						file: 'servers.json',
						template: '{"servers":{},"versions":{}}'
					}
				};
			
			for (let d of directories)
				if (!items.includes(d))
					fs.mkdirSync(path('data/' + d)),
					this.log.console(`${capitalise(d)} directory not found, creating it for you...`);

			for (let f in files)
				if (!items.includes(files[f].file))
					fs.writeFileSync(path('data/' + files[f].file), files[f].template),
					this.log.console(`${f} data file not found, creating it for you...`);	
		});

		this.log.info('Connecting to Discord API');

		this.on('ready', async () => {
			this.log.success(`Authenticated as ${this.user.tag}`);

			this.channel = this.channels.cache.get(this.config.channel_id);
			if (!this.channel)
				this.log.warn(`Could not get channel with ID of ${this.config.channel_id} in channels cache`);

			const Updater = require('./updater');
			const updater = new Updater(this);

			await updater.check();
			await updater.download();
			await updater.run();

			setInterval(() => updater.check(), 86400000); // check every day
			setInterval(() => updater.download(), 3600000); // download every hour
			setInterval(() => updater.run(), 43200000); // run every 12 hours
		});

		this.on('messageReactionAdd', (r, u) => {
			if (u.id === this.user.id) return;
			this.log.console('Message reaction event received');
			// current, approved
			// delete msg from file
		});
	}
}

const bot = new Bot();
bot.login();

process.on('unhandledRejection', error => {
	log.warn('An error was not caught');
	if (error instanceof Error) log.warn(`Uncaught ${error.name}: ${error.message}`);
	log.error(error);
});
