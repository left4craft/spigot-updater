class Updater {
	constructor(bot) {
		this.bot = bot;
		this.checkForUpdates = require('./checkForUpdates');
		this.downloadServers = require('./downloadServers');
		this.downloadPlugins = require('./downloadPlugins');
		this.uploadFiles = require('./uploadFiles');
	}

	async check() {
		let message = 'Running daily update check task';
		this.bot.log.info(message);
		/* this.bot.channel.send(
			new this.bot.Embed()
				.setTitle(`❗ ${message}`)
		); */
		
		await this.checkForUpdates(this.bot);
	}

	async download() {
		let message = 'Running hourly download task';
		this.bot.log.info(message);
		/* this.bot.channel.send(
			new this.bot.Embed()
				.setTitle(`❗ ${message}`)
		); */

		await this.downloadServers(this.bot);
		await this.downloadPlugins(this.bot);
	}
	
	async run() {
		let message = 'Running bi-daily upload task';
		this.bot.log.info(message);
		/* this.bot.channel.send(
			new this.bot.Embed()
				.setTitle(`❗ ${message}`)
		); */

		await this.uploadFiles(this.bot);
	}
}

module.exports = Updater;