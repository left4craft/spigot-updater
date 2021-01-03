const download = require('download');
const fs = require('fs');
const hasha = require('hasha');

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
			if (jar.get('downloaded') === jar.get('approved_build')) continue;

			let version = jar.get('approved_version'),
				build = jar.get('approved_build'),
				fileName = jar.get('approved_file');
			
			let file = path(`data/servers/${jar.get('id')}.jar`),
				url = `${API}/${p}/versions/${version}/builds/${build}/downloads/${fileName}`;
			
			const get = async  () => {
				fs.writeFileSync(file, await download(url));
				bot.log.console(`Downloaded ${capitalise(p)} ${v} (${build}): servers/${jar.get('id')}.jar`);
				return await hasha.fromFile(file, { algorithm: 'sha256' });
			};
			
			try {
				if (get() !== jar.get('approved_checksum')) {
					bot.log.warn(`Checksum did not match for ${capitalise(p)} ${v}, trying again`);
					if (get() !== jar.get('approved_checksum')) {
						throw new Error('Invalid checksum');
					}
				}
			} catch (e) {
				return bot.log.error(e);
			}

			jar = await jar.update({
				downloaded: build
			});
		
		}
	}
};