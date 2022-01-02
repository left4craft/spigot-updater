const fs = require('fs');
const { path } = require('../utils/fs');

module.exports = async (bot) => {
	bot.log.info('Checking for server jar updates');
	fs.readdir(path('data/servers/'), (err, items) => {
		let directories = new Set(Object.keys(bot.config.servers)
			.map(s => {
				let type = bot.config.servers[s].jar.type;
				let version = bot.config.servers[s].jar.version;
				return `${type}-${version.replace(/\./g, '-')}`;
			}));

		for (let d of directories) {
			if (!items.includes(d)) {
				fs.mkdirSync(path('data/servers/' + d));
			}
		}
	});

	if (bot.config.server_jars_api.toLowerCase() === 'papermc')
		await require('../paper/check')(bot);
	else
		await require('../serverjars/check')(bot);
	
	
	bot.log.info('Checking for plugin updates');
	await require('../spigot/check')(bot);
	await require('../github/check')(bot);
	await require('../jenkins/check')(bot);
};