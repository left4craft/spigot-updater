/**
 * @name spigot-updater
 * @author eartharoid <eartharoid@left4craft.org>
 * @license GNU-GPLv3
 */

require('dotenv').config();
const Logger = require('leekslazylogger');
const fs = require('fs');
const { path } = require('./utils/fs');

const { Client: DiscordClient } = require('discord.js');

class Bot extends DiscordClient {
	constructor() {
		super({
			autoReconnect: true,
		});

		this.config = require('../config/config');
		this.log = new Logger({
			name: 'Server updater',
			debug: this.config.debug,
			logToFile: this.config.save_logs
		});

		if (!fs.existsSync(path('data/downloads')))
			fs.mkdirSync(path('data/downloads')),
			this.log.console('Downloads directory not found, creating it for you...');

		if (!fs.existsSync(path('data/plugins')))
			fs.mkdirSync(path('data/plugins')),
			this.log.console('Plugins directory not found, creating it for you...');

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
			this.log.console('Message reaction event received');
		});
	}
}

const bot = new Bot();
bot.login();
