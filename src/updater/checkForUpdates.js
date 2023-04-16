const fs = require('fs');
const { path } = require('../utils/fs');

module.exports = async (updateapi) => {
	updateapi.log.info('Checking for server jar updates');
	fs.readdir(path('data/servers/'), (err, items) => {
		let directories = new Set(Object.keys(updateapi.servers)
			.map(s => {
				let type = updateapi.servers[s].jar.type;
				let version = updateapi.servers[s].jar.version;
				return `${type}-${version.replace(/\./g, '-')}`;
			}));

		for (let d of directories) {
			if (!items.includes(d)) {
				fs.mkdirSync(path('data/servers/' + d));
			}
		}
	});

	if (updateapi.config.server_jars_api.toLowerCase() === 'papermc')
		await require('../paper/check')(updateapi);
	else
		await require('../serverjars/check')(updateapi);
	
	
	updateapi.log.info('Checking for plugin updates');
	await require('../spigot/check')(updateapi);
	await require('../bukkit/check')(updateapi);
	await require('../github/check')(updateapi);
	await require('../jenkins/check')(updateapi);
};