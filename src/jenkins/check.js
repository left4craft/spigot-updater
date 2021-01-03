const fetch = require('node-fetch');

module.exports = async bot => {

	bot.log.console('Checking for updates for plugins on Jenkins');

	let plugins = {};
	Object.keys(bot.config.plugins)
		.filter(plugin => bot.config.plugins[plugin].source.toLowerCase() === 'jenkins')
		.forEach(plugin => plugins[plugin] = bot.config.plugins[plugin]);

	for (const p in plugins) {
		let host = plugins[p].host;
		if (host[host.length - 1] !== '/') host += '/';

		let { builds } = await (await fetch(host + `job/${plugins[p].job}/api/json`)).json();
		if (!builds) continue;

		let latest = builds[0];
		if (!latest) continue;

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

		if (plugin.get('latest') == latest.number) continue; // one is a string and the other in a number

		// there is a new version

		bot.log.console(`Found an update for '${plugins[p].jar}'`);

		await plugin.update({
			latest: latest.number,
		});

		let affected = Object.keys(bot.config.servers)
			.filter(s => bot.config.servers[s].plugins.includes(p))
			.map(s => `\`${s}\``)
			.join(', ');


		let msg = await bot.channel.send(
			// new bot.Embed()
			bot.utils.createEmbed()
				.setTitle(`🆕 A new version of ${p} is available`)
				.setDescription('React with ✅ to approve this update and add it to the queue.')
				.addField('Changelog', `> [Summary & status](${latest.url})\n\n> [Full changes](${latest.url}changes)`)
				.addField('Affected servers', `Servers using this plugin:\n${affected}`)
				.setFooter(`${plugins[p].job} build ${latest.number}`)
		);
		msg.react('✅');
		bot.messages.set(msg.id, {
			plugin: {
				name: p,
				version: latest.number,
			}
		});	

	}
};