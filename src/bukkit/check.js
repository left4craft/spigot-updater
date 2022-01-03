const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

puppeteer.use(StealthPlugin());
// puppeteer.use(AdblockerPlugin());

module.exports = async bot => {

	let plugins = {};
	Object.keys(bot.config.plugins)
		.filter(plugin => bot.config.plugins[plugin].source.toLowerCase() === 'bukkit')
		.forEach(plugin => plugins[plugin] = bot.config.plugins[plugin]);

	if (plugins.length < 1)
		return bot.log.info('No bukkit plugins need to be checked, skipping bukkit browser');

	bot.log.info('Checking for updates for plugins on bukkit');
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
		
	for (const p in plugins) {
		bot.log.info(`Checking '${plugins[p].jar}'`);

		await page.waitForTimeout(bot.config.navigation_delay);
		await page.goto(plugins[p].url);
		await page.waitForSelector('.project-file-download-button > a');

		let latest;
		try {	
			// eslint-disable-next-line no-undef
			const url = await page.evaluate(() => document.querySelector('.project-file-download-button > a').href);
			const parts = url.split('/');
			latest = parts[parts.length - 2]; // subtract 2 for next to last element bc zero indexed
			if (!latest) {
				bot.log.warn(`Couldn't find a version number for ${p}`);
				continue;
			}
		} catch (e) {
			bot.log.error(e);
		}

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

		if (plugin.get('approved') === latest) continue;

		// there is a new version

		bot.log.info(`Found an update for '${plugins[p].jar}'`);

		await plugin.update({
			latest: latest,
		});

		let affected = Object.keys(bot.config.servers)
			.filter(s => bot.config.servers[s].plugins.includes(p))
			.map(s => `\`${s}\``)
			.join(', ');


		let msg = await bot.channel.send({
			// new bot.Embed()
			embeds: [bot.utils.createEmbed()
				.setColor('ORANGE')
				.setTitle(`🆕 A new version of ${p} is available`)
				.setDescription('React with ✅ to approve this update and add it to the queue.')
				.addField('Changelog', `[View updates on SpigotMC](https://www.spigotmc.org/resources/${plugins[p].resource}/updates)`)
				.addField('Affected servers', `Servers using this plugin:\n${affected}`)
				.setFooter(`SpigotMC version ${latest}`)]
		});
		msg.react('✅');
		bot.messages.set(msg.id, {
			plugin: {
				name: p,
				version: latest,
			}
		});	
		
	}

	bot.log.info('Closing browser');
	await browser.close();	
};