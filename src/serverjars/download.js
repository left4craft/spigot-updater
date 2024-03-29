const download = require('download');
const fetch = require('node-fetch');
const fs = require('fs');
const hasha = require('hasha');

const { capitalise } = require('../utils');
const { path } = require('../utils/fs');

module.exports = async bot => {

	const API = 'https://serverjars.com/api';

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

			let build = jar.get('approved_build'),
				file = path(`data/servers/${jar.get('id')}/server.jar`);

			let data, latest, url;

			if (v === 'latest') {
				data = (await (await fetch(`${API}/fetchLatest/${p}`)).json()).response;
				latest = data;
				url = `${API}/fetchJar/${p}`;
			} else {
				data = (await (await fetch(`${API}/fetchAll/${p}`)).json()).response;
				latest = data.find(ver => ver.version === v);
				url = `${API}/fetchJar/${p}/${v}`;

				let supported = data.map(ver => ver.version);
				if (!latest)
					bot.log.warn(`Couldn't find a build for ${capitalise(p)} ${v}.\nVersions: ${supported.join(', ')}`);
			}

			const get = async () => {
				if (fs.existsSync(file))
					fs.unlinkSync(file);
				fs.writeFileSync(file, await download(url));
				bot.log.info(`Downloaded ${capitalise(p)} ${v} (${build}): servers/${jar.get('id')}.jar`);
				return hasha.fromFile(file, { algorithm: 'md5' });
			};

			try {
				if (await get() !== latest.md5) {
					bot.log.warn(`Checksum did not match for ${capitalise(p)} ${v}, trying again`);
					if (await get() !== latest.md5) {
						throw new Error('Invalid checksum');
					}
				}
			} catch (e) {
				bot.log.error(e);
				continue;
			}

			jar = await jar.update({
				downloaded: build
			});

			bot.log.info(`Downloaded ${capitalise(p)} ${v} (${build}): servers/${jar.get('id')}.jar`);
		}
	}
};