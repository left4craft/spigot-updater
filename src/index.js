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
		
		this.utils = require('./utils/discord');
		this.utils.init(this);

		Object.assign(this, {
			config,
			db: require('./database')(log),
			Embed: this.utils.Embed,
			log,
			messages: new Map(),
		});


		fs.readdir(path('data/'), (err, items) => {
			let directories = ['downloads', 'plugins']/* ,
				// files = ['messages.json', 'plugins.json', 'servers.json'];
				files = {
					plugins: {
						file: 'plugins.json',
						template: '{}'
					},
					servers: {
						file: 'servers.json',
						template: '{"servers":{},"versions":{}}'
					}
				} */;
			
			for (let d of directories)
				if (!items.includes(d))
					fs.mkdirSync(path('data/' + d)),
					this.log.console(`${capitalise(d)} directory not found, creating it for you...`);

			/* for (let f in files)
				if (!items.includes(files[f].file))
					fs.writeFileSync(path('data/' + files[f].file), files[f].template),
					this.log.console(`${capitalise(f)} data file not found, creating it for you...`);	 */
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
			if (r.emoji.name !== '✅' || r.message.channel.id !== this.config.channel_id) return;

			let data = this.messages.get(r.message.id);

			if (data.server_jar) { // server jar
				this.log.console(`${u.username} approved an update`);
				// current, approved

				/**
				{
				 	server_jar: {
				 		type: 'paper',
				 		version: '1.16.4',
				 		build: 352,
				 		changes: [
				 			[Object]
				 		],
				 		file: {
				 			name: 'paper-1.16.4-352.jar',
				 			sha256: '5dd29d4ee032bd3e635e856c61b49b5da86c8feb98d7923f4984059fef374af7'
				 		}
					}
				}
				 */

			} else { // plugin

			}

			// remove this message form the map, it has been approved
			this.messages.delete(r.message.id);
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
