const fetch = require('node-fetch');

module.exports = async updateapi => {

	const API = 'https://papermc.io/api/v2/projects';
	
	// this is just a warning, you'll probably get an error a few seconds later
	let { projects: valid } = (await (await fetch(API)).json());
	if (valid instanceof Array) { // if there isn't an error above
		for (let s in updateapi.servers) {
			let type = updateapi.servers[s].jar.type;
			if (!valid.includes(type))
				updaterapi.log.warn(`${s} server has an unsupported jar type: '${type}'.
			Supported jar types for PaperMC API: ${valid.join(', ')}.
			Switch server_jars_api to 'serverjars' in the config for more jar types.`);
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
			// console.log(p, v);
			let data = (await (await fetch(`${API}/${p}/version_group/${v}/builds`)).json()),
				{ builds } = data,
				latest = builds[builds.length - 1];

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

			if (jar.get('approved_build') == latest.build) continue;

			updateapi.log.info(`Found an update for ${data.project_name} ${v} (${jar.get('approved_build') || 0} -> ${latest.build})`);

			// let affected = Object.keys(updateapi.servers)
			// 	.filter(s => updateapi.servers[s].jar.type === p && updateapi.servers[s].jar.version === v)
			// 	.map(s => `\`${s}\``)
			// 	.join(', ');
			// let changes = latest.changes
			// // .map(c => '> ' + c.message.replace(/\n\S/gm, '\n> '))
			// 	.map(c => `> [${c.summary}](https://github.com/PaperMC/${data.project_name}/commit/${c.commit})`)
			// 	.join('\n\n');
					
			// let msg = await bot.channel.send({
			// 	// new bot.Embed()
			// 	embeds: [bot.utils.createEmbed()
			// 		.setColor('ORANGE')
			// 		.setTitle(`🆕 A new build of ${data.project_name} ${latest.version} is available (${jar.get('approved_build') || 0} -> ${latest.build})`)
			// 		.setDescription('React with ✅ to approve this update and add it to the queue.')
			// 		.addField('Changelog', 'Click commit summaries for more details.\n' + changes)
			// 		.addField('Affected servers', `Servers using ${data.project_name} ${v}:\n${affected}`)
			// 		.setFooter(`Build ${latest.build}`)]
			// });
			// msg.react('✅');
			// bot.messages.set(msg.id, {
			// 	server_jar: {
			// 		type: p,
			// 		version: v,
			// 		actual_version: latest.version,
			// 		build: latest.build,
			// 		changes: latest.changes,
			// 		file: latest.downloads.application.name,
			// 		checksum: latest.downloads.application.sha256,
			// 	}
			// });	

			if(updateapi.config.auto_approve) {
				jar = await jar.update({
					latest_version: latest.version,
					latest_build: latest.build,
					latest_changes: JSON.stringify(latest.changes),
					latest_file: latest.downloads.application.name,
					latest_checksum: latest.downloads.application.sha256,
				});

				jar = await jar.update({
					approved_version: latest.version,
					approved_build: latest.build,
					approved_changes: JSON.stringify(latest.changes),
					approved_file: latest.downloads.application.name,
					approved_checksum: latest.downloads.application.sha256,
				});
				updateapi.log.info(`Auto-approved update for '${data.project_name}'`);
			} else {
				jar = await jar.update({
					latest_version: latest.version,
					latest_build: latest.built,
					latest_changes: JSON.stringify(latest.changes),
					latest_file: latest.downloads.application.name,
					latest_checksum: latest.downloads.application.sha256,
				});
			}
			
		}
	}
};