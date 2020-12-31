const fetch = require('node-fetch');
const servers = require('../../config/servers');

const { capitalise } = require('../utils');

module.exports = async bot => {

	const API = 'https://serverjars.com/api';

	// this is just a warning, you'll probably get an error a few seconds later
	let { response: types, status } = (await (await fetch(`${API}/fetchTypes`)).json());
	if (types instanceof Object && status === 'success') { // if there isn't an error above
		let valid = [];
		for (let type in types) {
			for (let n of types[type]) {
				valid.push(n);
			}	
		}
		for (let s in servers) {
			let type = servers[s].jar.type;
			if (!valid.includes(type))
				bot.log.warn(`${s} server has an unsupported jar type: '${type}'`);
		}
	}

	// get an array of server jar types and make a Set to reduce the number of API calls
	let projects = new Set(Object.keys(servers).map(s => servers[s].jar.type));
	for (let p of projects) {
		// versions of each project
		let versions = new Set(
			Object.keys(servers)
				.filter(s => servers[s].jar.type === p)
				.map(s => servers[s].jar.version)
		);

		for (let v of versions) {
			let data,
				latest;
			
			if (v === 'latest') {
				data = (await (await fetch(`${API}/fetchLatest/${p}`)).json()).response;
				latest = data;
			} else {
				data = (await (await fetch(`${API}/fetchAll/${p}`)).json()).response;
				latest = data.find(ver => ver.version === v);

				let supported = data.map(ver => ver.version);
				if (!latest)
					bot.log.warn(`Couldn't find a build for ${capitalise(p)} ${v}.\nVersions: ${supported.join(', ')}`);
			}

			let jar = await bot.db.ServerJars.findOne({
				where: {
					type: p,
					version: v
				}
			});

			if (!jar) {
				jar = await bot.db.ServerJars.create({
					id: `${p}-${v.replace(/\./g, '-')}`,
					type: p,
					version: v
				});
			}

			if (jar.get('latest_build') !== latest.built) {

				bot.log.console(`Found an update for ${capitalise(p)} ${v}`);

				jar = await jar.update({
					latest_version: latest.version,
					latest_build: latest.built,
					latest_file: latest.file,
					latest_checksum: latest.md5,
				});

				let affected = Object.keys(servers)
					.filter(s => servers[s].jar.type === p && servers[s].jar.version === v)
					.map(s => `\`${s}\``)
					.join(', ');

				let msg = await bot.channel.send(
					// new bot.Embed()
					bot.utils.createEmbed()
						.setTitle(`🆕 A new build of ${capitalise(p)} ${latest.version} is available`)
						.setDescription('React with ✅ to approve this update and add it to the queue.')
						.addField('Changelog', 'ServerJars API does not provide a changelog or commit details.')
						.addField('Affected servers', `Servers using ${capitalise(p)} ${v}:\n${affected}`)
						.setFooter(`Built at ${new Date(latest.built * 1000).toLocaleString()}`)
				);
				msg.react('✅');
				bot.messages.set(msg.id, {
					server_jar: {
						type: p,
						version: latest.version,
						build: latest.built,
						file: latest.file,
						latest_checksum: latest.md5,
					}
				});

			}

		}
	}
};