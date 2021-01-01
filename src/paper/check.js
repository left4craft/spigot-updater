const fetch = require('node-fetch');
const servers = require('../../config/servers');

module.exports = async bot => {

	const API = 'https://papermc.io/api/v2/projects';
	
	// this is just a warning, you'll probably get an error a few seconds later
	let { projects: valid } = (await (await fetch(API)).json());
	if (valid instanceof Array) { // if there isn't an error above
		for (let s in servers) {
			let type = servers[s].jar.type;
			if (!valid.includes(type))
				bot.log.warn(`${s} server has an unsupported jar type: '${type}'.
			Supported jar types for PaperMC API: ${valid.join(', ')}.
			Switch server_jars_api to 'serverjars' in the config for more jar types.`);
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
			// console.log(p, v);
			let data = (await (await fetch(`${API}/${p}/version_group/${v}/builds`)).json()),
				{ builds } = data,
				latest = builds[builds.length - 1];

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

			if (jar.get('latest_build') !== latest.build) {

				bot.log.console(`Found an update for ${data.project_name} ${v} (${jar.get('latest_build') || 0} -> ${latest.build})`);

				/* jar.set('latest_version', latest.version); 
				jar.set('latest_build', latest.build); 
				jar.set('latest_changes', JSON.stringify(latest.changes)); 
				jar.set('latest_file', latest.downloads.application.name); 
				jar.save(); */

				jar = await jar.update({
					latest_version: latest.version,
					latest_build: latest.build,
					latest_changes: JSON.stringify(latest.changes),
					latest_file: latest.downloads.application.name,
					latest_checksum: latest.downloads.application.sha256,
				});

				let affected = Object.keys(servers)
					.filter(s => servers[s].jar.type === p && servers[s].jar.version === v)
					.map(s => `\`${s}\``)
					.join(', ');
				let changes = latest.changes
					// .map(c => '> ' + c.message.replace(/\n\S/gm, '\n> '))
					.map(c => `> [${c.summary}](https://github.com/PaperMC/${data.project_name}/commit/${c.commit})`)
					.join('\n\n');
					
				let msg = await bot.channel.send(
					// new bot.Embed()
					bot.utils.createEmbed()
						.setTitle(`🆕 A new build of ${data.project_name} ${latest.version} is available`)
						.setDescription('React with ✅ to approve this update and add it to the queue.')
						.addField('Changelog', 'Click commit summaries for more details.\n' + changes)
						.addField('Affected servers', `Servers using ${data.project_name} ${v}:\n${affected}`)
						.setFooter(`Build ${latest.build}`)
				);
				msg.react('✅');
				bot.messages.set(msg.id, {
					server_jar: {
						type: p,
						version: v,
						actual_version: latest.version,
						build: latest.build,
						changes: latest.changes,
						file: latest.downloads.application.name,
						latest_checksum: latest.downloads.application.sha256,
					}
				});

			}
			
		}
	}
};