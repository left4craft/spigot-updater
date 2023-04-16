const download = require('download');
const fetch = require('node-fetch');
const fs = require('fs');

const { path, unzip } = require('../utils/fs');

module.exports = async updateapi => {

	updateapi.log.info('Clearing temp directory');
	for (const file of fs.readdirSync(path('data/temp/'))) {
		fs.unlinkSync(path('data/temp/' + file));
	}

	updateapi.log.info('Checking for updates for plugins on GitHub');

	const API = 'https://api.github.com';

	let plugins = {};
	Object.keys(updateapi.plugins)
		.filter(plugin => updateapi.plugins[plugin].source.toLowerCase() === 'github')
		.forEach(plugin => plugins[plugin] = updateapi.plugins[plugin]);

	for (const p in plugins) {

		let plugin = await updateapi.db.Plugins.findOne({
			where: {
				name: p
			}
		});

		if (!plugin) continue;
		if (plugin.get('downloaded') === plugin.get('approved')) continue;

		if (fs.existsSync(path(`data/plugins/${plugins[p].jar}`)))
			fs.unlinkSync(path(`data/plugins/${plugins[p].jar}`));

		let tag = plugin.get('approved');
		let asset;

		if (plugins[p].asset instanceof RegExp) {
			let data = await (await fetch(`${API}/repos/${plugins[p].repository}/releases/tags/${tag}`)).json();
			if (!data.assets) {
				updateapi.log.warn(`Failed to get release assets for ${p}`);
				continue;
			}
			let item = data.assets.find(a => plugins[p].asset.test(a.name));
			if (!item) {
				updateapi.log.warn(`Failed to find asset for ${p}`);
				continue;
			}
			asset = item.name;
		} else {
			asset = plugins[p].asset.replace(/{{ ?tag ?}}/gi, tag);
		}
		
		let url = `https://github.com/${plugins[p].repository}/releases/download/${tag}/${asset}`;

		fs.writeFileSync(path(`data/temp/${plugins[p].jar}`), await download(url));

		updateapi.log.info(`Downloaded ${plugins[p].jar} (${tag}): plugins/${plugins[p].jar}`);

		let temp = fs.readdirSync(path('data/temp/'));
		if (temp.length < 1) {
			updateapi.log.warn(`Failed to download ${p}`);
			continue;
		}

		let file = temp[0];

		if (plugins[p].zip_path && file.toLowerCase().endsWith('.zip')) {
			updateapi.log.info('Extracting...');
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