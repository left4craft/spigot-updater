const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

module.exports = async bot => {

	let plugins = {};
	Object.keys(bot.config.plugins)
		.filter(plugin => bot.config.plugins[plugin].source.toLowerCase() === 'spigot')
		.forEach(plugin => plugins[plugin] = bot.config.plugins[plugin]);

	if (plugins.length < 1)
		return bot.log.console('No spigot plugins need to be checked, skipping spigot browser');

	bot.log.console('Checking for updates for plugins on SpigotMC');
	bot.log.console('Starting browser');

	const {
		PROXY
	} = process.env;

	const browser = await puppeteer.launch({
		headless: bot.config.headless_browser,
		args: [
			bot.config.no_sandbox_browser ? '--no-sandbox' : '',
			PROXY ? '--proxy-server=' + PROXY : ''
		]
	});

	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(config.cloudflare_timeout+10000);

	bot.log.console('Loading spigotmc.org (waiting for Cloudflare)');
	await page.goto('https://www.spigotmc.org/login');
	await page.waitForTimeout(config.cloudflare_timeout);
	// await page.waitForNavigation();
	await page.screenshot({ path: 'loaded.png', fullPage: true });

	const {
		SPIGOT_EMAIL,
		SPIGOT_PASSWORD
	} = process.env;
	if (SPIGOT_EMAIL && SPIGOT_PASSWORD) {
		bot.log.console('Logging into SpigotMC');
		try {
			await page.type('#ctrl_pageLogin_login', SPIGOT_EMAIL);
		} catch (e) {
			return bot.log.error(e);
		}
		await page.keyboard.press('Tab');
		await page.keyboard.type(SPIGOT_PASSWORD);
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		try {
			await page.waitForNavigation();
		} catch (e) {
			bot.log.error(e);
		}
		await page.screenshot({ path: 'authenticated.png', fullPage: true });
	} else {
		bot.log.console('Skipping authentication');
	}
		
	for (const p in plugins) {
		await page.goto(`https://www.spigotmc.org/resources/${plugins[p].resource}/updates`);

		let latest;
		try {	
			// eslint-disable-next-line no-undef
			const url = await page.evaluate(() => document.querySelector('.downloadButton > a').href);
			latest = (new URL(url)).searchParams.get('version');
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

		if (plugin.get('latest') === latest) continue;

		// there is a new version

		bot.log.console(`Found an update for '${plugins[p].jar}'`);

		await plugin.update({
			latest: latest,
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
				.addField('Changelog', `[View updates on SpigotMC](https://www.spigotmc.org/resources/${plugins[p].resource}/updates)`)
				.addField('Affected servers', `Servers using this plugin:\n${affected}`)
				.setFooter(`SpigotMC version ${latest}`)
		);
		msg.react('✅');
		bot.messages.set(msg.id, {
			plugin: {
				name: p,
				version: latest,
			}
		});	
		
	}

	bot.log.console('Closing browser');
	await browser.close();	
};