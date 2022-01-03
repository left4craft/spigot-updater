const fs = require('fs');

const { path, unzip } = require('../utils/fs');

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

puppeteer.use(StealthPlugin());
// puppeteer.use(AdblockerPlugin());

module.exports = async bot => {

	bot.log.info('Clearing temp directory');
	for (const file of fs.readdirSync(path('data/temp/'))) {
		fs.unlinkSync(path('data/temp/' + file));
	}


	let plugin_names = Object.keys(bot.config.plugins)
		.filter(plugin => bot.config.plugins[plugin].source.toLowerCase() === 'bukkit');
	for(let i = 0; i < plugin_names.length; i = i + 1) {
		let plugin = plugin_names[i];
		if(plugin === undefined) continue;
		let p = await bot.db.Plugins.findOne({
			where: {
				name: plugin
			}
		});
		if (!p || p.get('downloaded') === p.get('approved')) {
			plugin_names.splice(i, 1);
			i -= 1;
		}
	}
	let plugins = {};
	plugin_names.forEach(name => plugins[name] = bot.config.plugins[name]);

	if (plugin_names.length < 1)
		return bot.log.info('No bukkit plugins need to be downloaded, skipping bukkit browser');

	bot.log.info('Starting browser');

	const {
		PROXY,
		CHROMEPATH,
	} = process.env;

	let browser;

	if(CHROMEPATH) {
		browser = await puppeteer.launch({
			headless: bot.config.headless_browser,
			executablePath: CHROMEPATH,
			args: [
				bot.config.no_sandbox_browser ? '--no-sandbox' : '',
				PROXY ? '--proxy-server=' + PROXY : ''
			],
			userDataDir: 'data/sessioninfo/'
		});
	} else {
		browser = await puppeteer.launch({
			headless: bot.config.headless_browser,
			args: [
				bot.config.no_sandbox_browser ? '--no-sandbox' : '',
				PROXY ? '--proxy-server=' + PROXY : ''
			],
			userDataDir: 'data/sessioninfo/'
		});
	}

	const page = await browser.newPage();
	await page.setDefaultTimeout(bot.config.cloudflare_timeout);
	await page.setDefaultNavigationTimeout(bot.config.cloudflare_timeout);

	// // auto continue all requests to stop console error spam
	// page.on('request', request => Promise.resolve().then(() => request.continue()).catch(() => {}));

	await page._client.send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: path('data/temp/')
	});

	for (const p in plugins) {
		bot.log.info(`Updating download for '${plugins[p].jar}'`);

		try {
			let plugin = await bot.db.Plugins.findOne({
				where: {
					name: p
				}
			});
	
			if (!plugin) continue;
			if (plugin.get('downloaded') === plugin.get('approved')) continue;
	
			if (fs.existsSync(path(`data/plugins/${plugins[p].jar}`)))
				fs.unlinkSync(path(`data/plugins/${plugins[p].jar}`));
	
	
			let version = plugin.get('approved');
	
			let url = `https://dev.bukkit.org/projects/grief-prevention/files/${version}/download`;
	
			try {
				await page.waitForTimeout(bot.config.navigation_delay);
				bot.log.info(`Downloading ${p} (${version}): plugins/${plugins[p].jar}`);
				await page.goto(url);
			} catch (e) {
				// bot.log.info('Download error: ');
				// bot.log.error(e); // it doesn't like downloading
			}
	
			await page.waitForTimeout(bot.config.download_time);
	
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
				downloaded: version
			});	
		} catch (e) {
			bot.log.warn('Could not download plugin!')
			bot.log.error(e);
		}
	}

	bot.log.info('Closing browser');
	await browser.close();

};