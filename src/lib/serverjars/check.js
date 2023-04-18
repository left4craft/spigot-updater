const fetch = require('node-fetch');

const { capitalise } = require('../utils');

module.exports = async updateapi => {

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
		for (let s in updateapi.servers) {
			let type = updateapi.servers[s].jar.type;
			if (!valid.includes(type))
				updateapi.log.warn(`${s} server has an unsupported jar type: '${type}'`);
		}
	}

	// get an array of server jar types and make a Set to reduce the number of API calls
	let projects = new Set(Object.keys(updateapi.servers).map(s => updateapi.servers[s].jar.type));
	for (let p of projects) {
		// versions of each project
		let versions = new Set(
			Object.keys(updateapi.servers)
				.filter(s => updateapi.servers[s].jar.type === p)
				.map(s => updateapi.servers[s].jar.version)
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
					updateapi.log.warn(`Couldn't find a build for ${capitalise(p)} ${v}.\nVersions: ${supported.join(', ')}`);
			}

			let jar = await updateapi.db.ServerJars.findOne({
				where: {
					type: p,
					version: v
				}
			});

			if (!jar) {
				jar = await updateapi.db.ServerJars.create({
					id: `${p}-${v.replace(/\./g, '-')}`,
					type: p,
					version: v
				});
			}

			if (jar.get('latest_build') == latest.built) continue;

			updateapi.log.info(`Found an update for ${capitalise(p)} ${v}`);

			if(updateapi.config.auto_approve) {
				jar = await jar.update({
					latest_version: latest.version,
					latest_build: latest.built,
					latest_file: latest.file,
					latest_checksum: latest.md5,

					approved_version: latest.version,
					approved_build: latest.built,
					approved_file: latest.file,
					approved_checksum: latest.md5,
				});
				updateapi.log.info(`Auto-approved update for '${capitalise(p)}'`);
			} else {
				jar = await jar.update({
					latest_version: latest.version,
					latest_build: latest.built,
					latest_file: latest.file,
					latest_checksum: latest.md5,
				});
			}



			// let affected = Object.keys(updateapi.servers)
			// 	.filter(s => updateapi.servers[s].jar.type === p && updateapi.servers[s].jar.version === v)
			// 	.map(s => `\`${s}\``)
			// 	.join(', ');

			// let msg = await bot.channel.send({
			// 	// new bot.Embed()
			// 	embeds: [bot.utils.createEmbed()
			// 		.setColor('ORANGE')
			// 		.setTitle(`🆕 A new build of ${capitalise(p)} ${latest.version} is available`)
			// 		.setDescription('React with ✅ to approve this update and add it to the queue.')
			// 	// .addField('Changelog', 'ServerJars API does not provide a changelog or commit details.')
			// 		.addField('Affected servers', `Servers using ${capitalise(p)} ${v}:\n${affected}`)
			// 		.setFooter(`Built at ${new Date(latest.built * 1000).toLocaleString()}`)]
			// });
			// msg.react('✅');
			// bot.messages.set(msg.id, {
			// 	server_jar: {
			// 		type: p,
			// 		version: v,
			// 		actual_version: latest.version,
			// 		build: latest.built,
			// 		file: latest.file,
			// 		checksum: latest.md5,
			// 	}
			// });

		}
	}
};