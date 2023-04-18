const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

puppeteer.use(StealthPlugin());
// puppeteer.use(AdblockerPlugin());

module.exports = async updateapi => {

	let plugins = {};
	Object.keys(updateapi.plugins)
		.filter(plugin => updateapi.plugins[plugin].source.toLowerCase() === 'spigot')
		.forEach(plugin => plugins[plugin] = updateapi.plugins[plugin]);

	if (plugins.length < 1)
		return updateapi.log.info('No spigot plugins need to be checked, skipping spigot browser');

	updateapi.log.info('Checking for updates for plugins on SpigotMC');
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
		updateapi.log.info(`Checking '${plugins[p].jar}'`);

		try {
			await page.waitForTimeout(updateapi.config.navigation_delay);
			await page.goto(`https://www.spigotmc.org/resources/${plugins[p].resource}/updates`);
			await page.waitForSelector('.downloadButton > a');
	
			let latest;
			try {	
				// eslint-disable-next-line no-undef
				const url = await page.evaluate(() => document.querySelector('.downloadButton > a').href);
				latest = (new URL(url)).searchParams.get('version');
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
			// 		.addField('Changelog', `[View updates on SpigotMC](https://www.spigotmc.org/resources/${plugins[p].resource}/updates)`)
			// 		.addField('Affected servers', `Servers using this plugin:\n${affected}`)
			// 		.setFooter(`SpigotMC version ${latest}`)]
			// });
			// msg.react('✅');
			// bot.messages.set(msg.id, {
			// 	plugin: {
			// 		name: p,
			// 		version: latest,
			// 	}
			// });		
		} catch (e) {
			updateapi.log.warn('Could not check plugin!')
			updateapi.log.error(e);
		}
		
	}

	updateapi.log.info('Closing browser');
	await browser.close();	
};