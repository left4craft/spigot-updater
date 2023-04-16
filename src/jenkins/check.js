const fetch = require('node-fetch');

module.exports = async updateapi => {

	updateapi.log.info('Checking for updates for plugins on Jenkins');

	let plugins = {};
	Object.keys(updateapi.plugins)
		.filter(plugin => updateapi.plugins[plugin].source.toLowerCase() === 'jenkins')
		.forEach(plugin => plugins[plugin] = updateapi.plugins[plugin]);

	for (const p in plugins) {
		let host = plugins[p].host;
		if (host[host.length - 1] !== '/') host += '/';

		let { builds } = await (await fetch(host + `job/${plugins[p].job}/api/json`)).json();
		if (!builds) continue;

		let latest = builds[0];
		if (!latest) continue;

		let plugin = await updateapi.db.Plugins.findOne({
			where: {
				name: p
			}
		});

		if (!plugin) {
			plugin = await updateapi.db.Plugins.create({
				name: p
			});
		}

		if (plugin.get('approved') == latest.number) continue; // one is a string and the other in a number

		// there is a new version

		updateapi.log.info(`Found an update for '${plugins[p].jar}'`);

		if(updateapi.config.auto_approve) {
			await plugin.update({
				approved: latest.number,
				latest: latest.number,
			});
			updateapi.log.info(`Auto-approved update for '${plugins[p].jar}'`);
		} else {
			await plugin.update({
				latest: latest.number,
			});
		}
		// let affected = Object.keys(updateapi.servers)
		// 	.filter(s => updateapi.servers[s].plugins.includes(p))
		// 	.map(s => `\`${s}\``)
		// 	.join(', ');


		// let msg = await bot.channel.send({
		// 	// new bot.Embed()
		// 	embeds: [bot.utils.createEmbed()
		// 		.setColor('ORANGE')
		// 		.setTitle(`🆕 A new version of ${p} is available`)
		// 		.setDescription('React with ✅ to approve this update and add it to the queue.')
		// 		.addField('Changelog', `> [Summary & status](${latest.url})\n\n> [Full changes](${latest.url}changes)`)
		// 		.addField('Affected servers', `Servers using this plugin:\n${affected}`)
		// 		.setFooter(`${plugins[p].job} build ${latest.number}`)]
		// });
		// msg.react('✅');
		// bot.messages.set(msg.id, {
		// 	plugin: {
		// 		name: p,
		// 		version: latest.number,
		// 	}
		// });	

	}
};