const download = require('download');
const fetch = require('node-fetch');
const fs = require('fs');

const { path, unzip } = require('../utils/fs');

module.exports = async bot => {

	bot.log.info('Clearing temp directory');
	for (const file of fs.readdirSync(path('data/temp/'))) {
		fs.unlinkSync(path('data/temp/' + file));
	}

	bot.log.info('Checking for updates for plugins on Jenkins');

	let plugins = {};
	Object.keys(bot.config.plugins)
		.filter(plugin => bot.config.plugins[plugin].source.toLowerCase() === 'jenkins')
		.forEach(plugin => plugins[plugin] = bot.config.plugins[plugin]);

	for (const p in plugins) {

		let plugin = await bot.db.Plugins.findOne({
			where: {
				name: p
			}
		});

		if (!plugin) continue;
		if (plugin.get('downloaded') === plugin.get('approved')) continue;

		if (fs.existsSync(path(`data/plugins/${plugins[p].jar}`)))
			fs.unlinkSync(path(`data/plugins/${plugins[p].jar}`));

		let build = plugin.get('approved');

		let host = plugins[p].host;
		if (host[host.length - 1] !== '/') host += '/';

		let { artifacts } = await (await fetch(host + `job/${plugins[p].job}/${build}/api/json`)).json();

		if (!artifacts) {
			bot.log.warn(`Failed to get artifacts for ${p}`);
			continue;
		}

		let item;
		if (plugins[p].artifact instanceof RegExp) {
			item = artifacts.find(a => plugins[p].artifact.test(a.fileName));
		} else {
			item = artifacts.find(a => plugins[p].artifact
				.replace(/{{ ?build ?}}/gi, build) === a.fileName);
		}
		
		if (!item) {
			bot.log.warn(`Failed to find artifact for ${p}`);
			continue;
		}

		let artifact = item.relativePath;
		let url = host + `job/${plugins[p].job}/${build}/artifact/${artifact}`;

		fs.writeFileSync(path(`data/temp/${plugins[p].jar}`), await download(url));

		bot.log.info(`Downloaded ${plugins[p].jar} (${build}): plugins/${plugins[p].jar}`);

		let temp = fs.readdirSync(path('data/temp/'));
		if (temp.length < 1) {
			bot.log.warn(`Failed to download ${p}`);
			continue;
		}

		let file = temp[0];

		if (plugins[p].zip_path && file.toLowerCase().endsWith('.zip')) {
			bot.log.info('Extracting...');
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
			downloaded: build
		});
	}

};