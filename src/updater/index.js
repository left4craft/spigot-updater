class Updater {
	constructor(updateapi) {
		this.updateapi = updateapi;
		this.checkForUpdates = require('./checkForUpdates');
		this.downloadServers = require('./downloadServers');
		this.downloadPlugins = require('./downloadPlugins');
		this.uploadFiles = require('./uploadFiles');
	}

	async check() {
		let message = 'Running daily update check task';
		this.updateapi.log.info(message);

		await this.checkForUpdates(this.updateapi);
	}

	async download() {
		let message = 'Running hourly download task';
		this.updateapi.log.info(message);

		await this.downloadServers(this.updateapi);
		await this.downloadPlugins(this.updateapi);
	}
	
	async run() {
		let message = 'Running bi-daily upload task';
		this.updateapi.log.info(message);

		await this.uploadFiles(this.updateapi);
	}
}

module.exports = Updater;