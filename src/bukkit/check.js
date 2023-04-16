const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

puppeteer.use(StealthPlugin());
// puppeteer.use(AdblockerPlugin());

module.exports = async updateapi => {

	let plugins = {};
	Object.keys(updateapi.plugins)
		.filter(plugin => updateapi.plugins[plugin].source.toLowerCase() === 'bukkit')
		.forEach(plugin => plugins[plugin] = updateapi.plugins[plugin]);

	if (plugins.length < 1)
		return updateapi.log.info('No bukkit plugins need to be checked, skipping bukkit browser');

	updateapi.log.info('Checking for updates for plugins on bukkit');
	updateapi.log.info('Starting browser');

	const {
		PROXY,
		CHROMEPATH,
	} = process.env;

	let browser;

	if(CHROMEPATH) {
		browser = await puppeteer.launch({
			headless: updateapi.config.headless_browser,
			executablePath: CHROMEPATH,
			args: [
				updateapi.config.no_sandbox_browser ? '--no-sandbox' : '',
				PROXY ? '--proxy-server=' + PROXY : ''
			],
			userDataDir: 'data/sessioninfo/'
		});
	} else {
		browser = await puppeteer.launch({
			headless: updateapi.config.headless_browser,
			args: [
				updateapi.config.no_sandbox_browser ? '--no-sandbox' : '',
				PROXY ? '--proxy-server=' + PROXY : ''
			],
			userDataDir: 'data/sessioninfo/'
		});
	}

	const page = await browser.newPage();
	await page.setDefaultTimeout(updateapi.config.cloudflare_timeout);
	await page.setDefaultNavigationTimeout(updateapi.config.cloudflare_timeout);
		
	for (const p in plugins) {
		updateapi.log.info(`Checking '${plugins[p].jar}'`);

		try {
			await page.waitForTimeout(updateapi.config.navigation_delay);

			let url = plugins[p].url
			if(url[url.length - 1] !== '/') url += '/';
			await page.goto(plugins[p].url + 'files');
			
			await page.waitForSelector('.project-file-download-button > a');
	
			let latest;
			try {	
				// eslint-disable-next-line no-undef
				const url = await page.evaluate(() => document.querySelector('.project-file-download-button > a').href);
				const parts = url.split('/');
				latest = parts[parts.length - 2]; // subtract 2 for next to last element bc zero indexed
				if (!latest) {
					updateapi.log.warn(`Couldn't find a version number for ${p}`);
					continue;
				}
			} catch (e) {
				updateapi.log.error(e);
			}
	
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
	
			if (plugin.get('approved') === latest) continue;
	
			// there is a new version
	
			updateapi.log.info(`Found an update for '${plugins[p].jar}'`);
	
			if(updateapi.config.auto_approve) {
				await plugin.update({
					approved: latest,
					latest: latest,
				});
				updateapi.log.info(`Auto-approved update for '${plugins[p].jar}'`);
			} else {
				await plugin.update({
					latest: latest,
				});
			}

	
			let affected = Object.keys(updateapi.servers)
				.filter(s => updateapi.servers[s].plugins.includes(p))
				.map(s => `\`${s}\``)
				.join(', ');
	
	
			console.log('Affected by update: ' + affected)
		} catch (e) {
			updateapi.log.warn('Could not check plugin!')
			updateapi.log.error(e);
		}
		
	}

	updateapi.log.info('Closing browser');
	await browser.close();	
};