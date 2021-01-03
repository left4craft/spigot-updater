const fetch = require('node-fetch');

module.exports = async bot => {

	bot.log.console('Checking for updates for plugins on GitHub');

	const API = 'https://api.github.com';

	let plugins = {};
	Object.keys(bot.config.plugins)
		.filter(plugin => bot.config.plugins[plugin].source.toLowerCase() === 'github')
		.forEach(plugin => plugins[plugin] = bot.config.plugins[plugin]);

	for (const p in plugins) {
		let data = await (await fetch(`${API}/repos/${plugins[p].repository}/releases/latest`)).json();
		if (data.draft || data.prerelease) continue;

		let plugin = await bot.db.Plugins.findOne({
			where: {
				name: p
			}
		});

		if (!plugin) {
			plugin = await bot.db.Plugins.create({
				name: p
			});
		}

		if (plugin.get('latest') === data.tag_name) continue;

		// there is a new version

		bot.log.console(`Found an update for '${plugins[p].jar}'`);

		await plugin.update({
			latest: data.tag_name,
		});

		let affected = Object.keys(bot.config.servers)
			.filter(s => bot.config.servers[s].plugins.includes(p))
			.map(s => `\`${s}\``)
			.join(', ');


		let msg = await bot.channel.send(
			// new bot.Embed()
			bot.utils.createEmbed()
				.setColor('ORANGE')
				.setTitle(`🆕 A new version of ${p} is available`)
				.setDescription('React with ✅ to approve this update and add it to the queue.')
				.addField('Changelog', `[View on GitHub](https://github.com/${plugins[p].repository}/releases/tag/${data.tag_name})`)
				// ^ could also use target_commitish and the previous release's tag_name to link commits 
				.addField('Affected servers', `Servers using this plugin:\n${affected}`)
				.setFooter(`GitHub release ${data.tag_name}`)
		);
		msg.react('✅');
		bot.messages.set(msg.id, {
			plugin: {
				name: p,
				version: data.tag_name,
			}
		});	
	}

	

};