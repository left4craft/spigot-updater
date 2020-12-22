const panel = require('../pterodactyl');
const { getPlayerCount } = require('../utils/minecraft');
const servers = require('../../config/servers');

module.exports = async (bot) => {

	for (let server in servers) {

		let players = await getPlayerCount(bot, server);

		if (players > servers[server].max_players) {
			bot.log.info(`Skipping ${server}, too many players online`);
			continue;
		}

	}
	
};
