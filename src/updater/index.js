class Updater {
	constructor(bot) {
		this.bot = bot;
		this.checkForUpdates = require('./checkForUpdates');
		this.downloadServers = require('./downloadServers');
		this.downloadPlugins = require('./downloadPlugins');
		this.uploadFiles = require('./uploadFiles');
	}

	async run() {
		this.bot.log.info('Running daily update task');
		await this.checkForUpdates(this.bot);
		await this.downloadServers(this.bot);
		await this.downloadPlugins(this.bot);
		await this.uploadFiles(this.bot);
	}
}

module.exports = Updater;