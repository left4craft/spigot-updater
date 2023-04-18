const fs = require('fs');

const { path, unzip } = require('../utils/fs');

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

puppeteer.use(StealthPlugin());
// puppeteer.use(AdblockerPlugin());

module.exports = async updateapi => {

	updateapi.log.info('Clearing temp directory');
	for (const file of fs.readdirSync(path('data/temp/'))) {
		fs.unlinkSync(path('data/temp/' + file));
	}


	let plugin_names = Object.keys(updateapi.plugins)
		.filter(plugin => updateapi.plugins[plugin].source.toLowerCase() === 'spigot');
	for(let i = 0; i < plugin_names.length; i = i + 1) {
		let plugin = plugin_names[i];
		if(plugin === undefined) continue;
		let p = await updateapi.db.Plugins.findOne({
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
	plugin_names.forEach(name => plugins[name] = updateapi.plugins[name]);

	if (plugin_names.length < 1)
		return updateapi.log.info('No spigot plugins need to be downloaded, skipping spigot browser');

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

	// // auto continue all requests to stop console error spam
	// page.on('request', request => Promise.resolve().then(() => request.continue()).catch(() => {}));

	const client = await page.target().createCDPSession();
	await client.send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: path('data/temp/'),
	});

	// await page._client.send('Page.setDownloadBehavior', {
	// 	behavior: 'allow',
	// 	downloadPath: path('data/temp/')
	// });

	await page.waitForTimeout(updateapi.config.navigation_delay);
	updateapi.log.info('Loading spigotmc.org (waiting for Cloudflare)');
	await page.goto('https://www.spigotmc.org/login');
	// await page.waitForTimeout(updateapi.config.cloudflare_timeout);
	try {
		await page.waitForSelector('.spigot_colorOverlay');
		updateapi.log.info('Loaded spigotmc.org! Saving screenshot as loaded.png...');
		await page.waitForTimeout(updateapi.config.navigation_delay);
		await page.screenshot({ path: 'loaded.png', fullPage: true });

		if(page.url().endsWith('login')) {
			updateapi.log.info('Found login page, attempting to log in...');
			// await page.waitForNavigation();
		
			const {
				SPIGOT_EMAIL,
				SPIGOT_PASSWORD
			} = process.env;
			if (SPIGOT_EMAIL && SPIGOT_PASSWORD) {
				updateapi.log.info('Logging into SpigotMC');
				try {
					await page.type('#ctrl_pageLogin_login', SPIGOT_EMAIL);
				} catch (e) {
					return updateapi.log.error(e);
				}
				await page.keyboard.press('Tab');
				await page.keyboard.type(SPIGOT_PASSWORD);
				await page.keyboard.press('Tab');
				await page.keyboard.press('Enter');
				try {
					await page.waitForNavigation();
				} catch (e) {
					updateapi.log.error(e);
				}
				updateapi.log.info('Logged in, screenshot saved as authenticated.png');
				await page.screenshot({ path: 'authenticated.png', fullPage: true });
			} else {
				updateapi.log.info('Skipping authentication');
			}
		} else {
			updateapi.log.info('Already logged in!');
		}
	} catch (e) {
		updateapi.log.info('Screenshotting as error.png');
		await page.screenshot({ path: 'error.png', fullPage: true });
		return updateapi.log.error(e);
	}

	for (const p in plugins) {
		updateapi.log.info(`Updating download for '${plugins[p].jar}'`);

		try {
			let plugin = await updateapi.db.Plugins.findOne({
				where: {
					name: p
				}
			});
	
			if (!plugin) continue;
			if (plugin.get('downloaded') === plugin.get('approved')) continue;
	
			if (fs.existsSync(path(`data/plugins/${plugins[p].jar}`)))
				fs.unlinkSync(path(`data/plugins/${plugins[p].jar}`));
	
	
			let version = plugin.get('approved');
	
			let url = `https://www.spigotmc.org/resources/${plugins[p].resource}/download?version=${version}`;
	
			try {
				await page.waitForTimeout(updateapi.config.navigation_delay);
				updateapi.log.info(`Downloading ${p} (${version}): plugins/${plugins[p].jar}`);
				await page.goto(url);
			} catch (e) {
				// updateapi.log.info('Download error: ');
				// updateapi.log.error(e); // it doesn't like downloading
			}
	
			await page.waitForTimeout(updateapi.config.download_time);
	
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
				downloaded: version
			});	
		} catch (e) {
			updateapi.log.warn('Could not download plugin!')
			updateapi.log.error(e);
		}
	}

	updateapi.log.info('Closing browser');
	await browser.close();

};