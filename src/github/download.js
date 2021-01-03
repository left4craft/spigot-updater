const download = require('download');
const fetch = require('node-fetch');
const fs = require('fs');

const { path, unzip } = require('../utils/fs');

module.exports = async bot => {

	bot.log.console('Clearing temp directory');
	for (const file of fs.readdirSync(path('data/temp/'))) {
		fs.unlinkSync(path('data/temp/' + file));
	}

	bot.log.console('Checking for updates for plugins on GitHub');

	const API = 'https://api.github.com';

	let plugins = {};
	Object.keys(bot.config.plugins)
		.filter(plugin => bot.config.plugins[plugin].source.toLowerCase() === 'github')
		.forEach(plugin => plugins[plugin] = bot.config.plugins[plugin]);

	for (const p in plugins) {
		
		if (fs.existsSync(path(`data/plugins/${plugins[p].jar}`)))
			fs.unlinkSync(path(`data/plugins/${plugins[p].jar}`));

		let plugin = await bot.db.Plugins.findOne({
			where: {
				name: p
			}
		});

		if (!plugin) continue;
		if (plugin.get('downloaded') === plugin.get('approved')) continue;

		let tag = plugin.get('approved');
		let asset;

		if (plugins[p].asset instanceof RegExp) {
			let data = await (await fetch(`${API}/repos/${plugins[p].repository}/releases/tags/${tag}`)).json();
			if (!data.assets) {
				bot.log.warn(`Failed to get release assets for ${p}`);
				continue;
			}
			let item = data.assets.find(a => plugins[p].asset.test(a.name));
			if (!item) {
				bot.log.warn(`Failed to find asset for ${p}`);
				continue;
			}
			asset = item.name;
		} else {
			asset = plugins[p].asset;
		}
		
		let url = `https://github.com/${plugins[p].repository}/releases/download/${tag}/${asset}`;

		fs.writeFileSync(path(`data/temp/${plugins[p].jar}`), await download(url));

		bot.log.console(`Downloaded ${plugins[p].jar}: servers/${plugins[p].jar}`);

		let temp = fs.readdirSync(path('data/temp/'));
		if (temp.length < 1) {
			bot.log.warn(`Failed to download ${p}`);
			continue;
		}

		let file = temp[0];

		if (plugins[p].zip_path && file.toLowerCase().endsWith('.zip')) {
			bot.log.console('Extracting...');
			await unzip(
				plugins[p].zip_path,
				path(`data/temp/${file}`),
				path(`data/plugins/${plugins[p].jar}`)
			);
			fs.unlinkSync(path(`data/temp/${file}`));
		} else {
			fs.renameSync(path(`data/temp/${file}`), path(`data/plugins/${plugins[p].jar}`));
		}

		plugin = await plugin.update({
			downloaded: tag
		});
	}

};