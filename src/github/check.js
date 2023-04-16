const fetch = require('node-fetch');

module.exports = async updateapi => {

	updateapi.log.info('Checking for updates for plugins on GitHub');

	const API = 'https://api.github.com';

	let plugins = {};
	Object.keys(updateapi.plugins)
		.filter(plugin => updateapi.plugins[plugin].source.toLowerCase() === 'github')
		.forEach(plugin => plugins[plugin] = updateapi.plugins[plugin]);

	for (const p in plugins) {
		let data = await (await fetch(`${API}/repos/${plugins[p].repository}/releases/latest`)).json();
		if (data.draft || data.prerelease) continue;

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

		if (plugin.get('approved') === data.tag_name) continue;

		// there is a new version

		updateapi.log.info(`Found an update for '${plugins[p].jar}'`);

		if(updateapi.config.auto_approve) {
			await plugin.update({
				approved: data.tag_name,
				latest: data.tag_name,
			});
			updateapi.log.info(`Auto-approved update for '${plugins[p].jar}'`);
		} else {
			await plugin.update({
				latest: data.tag_name,
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
		// 		.addField('Changelog', `[View on GitHub](https://github.com/${plugins[p].repository}/releases/tag/${data.tag_name})`)
		// 		// ^ could also use target_commitish and the previous release's tag_name to link commits 
		// 		.addField('Affected servers', `Servers using this plugin:\n${affected}`)
		// 		.setFooter(`GitHub release ${data.tag_name}`)]
		// });
		// msg.react('✅');
		// bot.messages.set(msg.id, {
		// 	plugin: {
		// 		name: p,
		// 		version: data.tag_name,
		// 	}
		// });	
	}

	

};