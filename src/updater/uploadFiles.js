const panel = require('../pterodactyl');
const { getPlayerCount } = require('../utils/minecraft');

module.exports = async (bot) => {

	for (let server in bot.config.servers) {

		let players = await getPlayerCount(bot, server);

		if (players > bot.config.servers[server].max_players) {
			bot.log.info(`Skipping ${server}, too many players online`);
			continue;
		}

	}
	
};
