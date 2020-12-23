/**
 * @name spigot-updater
 * @author eartharoid <eartharoid@left4craft.org>
 * @license GNU-GPLv3
 */

require('dotenv').config();
const fs = require('fs');
const { path } = require('./utils/fs');

const config = require('../config/config');

const Logger = require('leekslazylogger');
const log = new Logger({
	name: 'Server updater',
	debug: config.debug,
	logToFile: config.save_logs
});

if (!fs.existsSync(path('data/downloads')))
	fs.mkdirSync(path('data/downloads')),
	log.console('Downloads directory not found, creating it for you...');

if (!fs.existsSync(path('data/plugins')))
	fs.mkdirSync(path('data/plugins')),
	log.console('Plugins directory not found, creating it for you...');

const { Client: DiscordClient } = require('discord.js');

class Bot extends DiscordClient {
	constructor() {
		super({
			autoReconnect: true,
		});
		Object.assign(this, {
			config,
			log
		});
	}
}

const bot = new Bot();

log.info('Connecting to Discord API');

bot.on('ready', async () => {
	log.success(`Authenticated as ${bot.user.tag}`);
	// bot.channels.cache.get(config.channel_id).send('✅ Started');

	const Updater = require('./updater');
	const updater = new Updater(bot);

	await updater.check();
	await updater.download();
	await updater.run();

	setInterval(() => updater.check(), 86400000); // check every day
	setInterval(() => updater.download(), 3600000); // download every hour
	setInterval(() => updater.run(), 43200000); // run every 12 hours
});

bot.on('messageReactionAdd', (r, u) => {
	log.console('Message reaction event received');
});

bot.login();


// 69 ;)