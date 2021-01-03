const download = require('download');
const fs = require('fs');

const { capitalise } = require('../utils');
const { path } = require('../utils/fs');

module.exports = async bot => {

	const API = 'https://papermc.io/api/v2/projects';

	let projects = new Set(Object.keys(bot.config.servers).map(s => bot.config.servers[s].jar.type));
	for (let p of projects) {
		// versions of each project
		let versions = new Set(
			Object.keys(bot.config.servers)
				.filter(s => bot.config.servers[s].jar.type === p)
				.map(s => bot.config.servers[s].jar.version)
		);

		for (let v of versions) {
			let jar = await bot.db.ServerJars.findOne({
				where: {
					type: p,
					version: v
				}
			});
			if (!jar) continue;

			let version = jar.get('approved_version'),
				build = jar.get('approved_build'),
				file = jar.get('approved_file');
			
			try {
				fs.writeFileSync(path(`data/servers/${jar.get('id')}.jar`),
					await download(`${API}/${p}/versions/${version}/builds/${build}/downloads/${file}`));
			} catch (e) {
				return bot.log.error(e);
			}

			jar = await jar.update({
				downloaded: build
			});

			bot.log.console(`Downloaded ${capitalise(p)} ${v} (${build}): servers/${jar.get('id')}.jar`);
		}
	}
};