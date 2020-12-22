const minecraft = require('minecraft-server-util');
const fetch = require('node-fetch');

const config = require('../../config/config');
const servers = require('../../config/servers');

module.exports = {
	getPlayerCount(bot, server) {
		return new Promise((resolve, reject) => {

			if (servers[server].host) {

				let host = servers[server].host.split(':'),
					ip = host[0],
					port = host[1];
				
				let data = minecraft.status(ip, {
					port
				}).then(() => {
					resolve(data.onlinePlayers);
				}).catch(() => {
					bot.log.warn(`Failed to get player count for ${server} server`);
					resolve(0);
				});

			} else if (servers[server].left4status && config.left4status.length > 1) {

				let host = config.left4status;
				if (host[host.length - 1] !== '/')
					host += '/';
				fetch(host + 'api/status/minecraft')
					.then(res => res.json())
					.then(json => {
						let data = json.services[server];
						if (!data) {
							bot.log.warn(`${server} does not exist in the response from Left4Status`);
							return resolve(0);
						} else {
							resolve(data.player_count);
						}
					});
			} else {
				reject(new Error(`${server}'s host is not set and the left4status ID or address is missing`));
			}

		});	
	}
};