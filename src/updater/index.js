const { getPlayerCount } = require('../utils/minecraft');
class Updater {
	constructor(bot) {
		this.bot = bot;
		this.checkForUpdates = require('./checkForUpdates');
		this.updateServers = require('./updateServers');
		this.updatePlugins = require('./updatePlugins');
	}

	async run() {
		this.bot.log.info('Running daily update task');
		await this.checkForUpdates(this.bot);
		this.bot.log.warn(await getPlayerCount());
		if (! await getPlayerCount() < this.bot.config.maxPlayers) return;
		await this.updateServers(this.bot);
		await this.updatePlugins(this.bot);
	}
}

module.exports = Updater;