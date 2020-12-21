/**
 * @name spigot-updater
 * @author eartharoid <eartharoid@left4craft.org>
 * @license GNU-GPLv3
 */

/**
 * 



 * @TODO check data/downloads and data/plugins exist




 */

require('dotenv').config();
const fs = require('fs');
const { path } = require('./utils');

const config = require('../config/config');

const Logger = require('leekslazylogger');
const log = new Logger({
	name: 'Server updater',
	debug: config.debug,
	logToFile: config.saveLogs
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

bot.on('ready', () => {
	log.success(`Authenticated as ${bot.user.tag}`);
	// bot.channels.cache.find(c => c.name === 'server-updater').send('✅ Started');
});

bot.on('messageReactionAdd', (r, u) => {
	
});

bot.login();