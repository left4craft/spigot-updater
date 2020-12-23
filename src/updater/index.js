class Updater {
	constructor(bot) {
		this.bot = bot;
		this.checkForUpdates = require('./checkForUpdates');
		this.downloadServers = require('./downloadServers');
		this.downloadPlugins = require('./downloadPlugins');
		this.uploadFiles = require('./uploadFiles');
	}

	async check() {
		this.bot.log.info('Running daily update check task');
		await this.checkForUpdates(this.bot);
		
	}
	async download() {
		this.bot.log.info('Running hourly download task');
		await this.downloadServers(this.bot);
		await this.downloadPlugins(this.bot);
	}
	async run() {
		this.bot.log.info('Running bi-daily upload task');
		await this.uploadFiles(this.bot);
	}
}

module.exports = Updater;