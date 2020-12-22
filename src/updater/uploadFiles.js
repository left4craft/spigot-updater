const panel = require('../pterodactyl');
const { getPlayerCount } = require('../utils/minecraft');
const servers = require('../../config/servers');

module.exports = async (bot) => {
	for (let server in servers) {
		bot.log.warn(`${server}'s player count: ${await getPlayerCount(bot, server)}`);
	}
	
};
