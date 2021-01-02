const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

module.exports = async bot => {

	bot.log.console('Checking for updates for plugins on SpigotMC');
	bot.log.console('Starting browser');

	const browser = await puppeteer.launch({
		headless: bot.config.headless_browser,
		args: [
			'--proxy-server=\'direct://\'',
			'--proxy-bypass-list=*'
		]
	});

	const page = await browser.newPage();
	await page._client.send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: './data/downloads'
	});

	bot.log.console('Loading page (waiting for Cloudflare)');
	await page.goto('https://www.spigotmc.org/login');
	await page.waitForTimeout(10000);
	// await page.waitForNavigation();
	await page.screenshot({ path: 'loaded.png', fullPage: true });
	bot.log.console('Logging into SpigotMC');
	await page.type('#ctrl_pageLogin_login', process.env.SPIGOT_EMAIL);
	await page.keyboard.press('Tab');
	await page.keyboard.type(process.env.SPIGOT_PASSWORD);
	await page.keyboard.press('Tab');
	await page.keyboard.press('Enter');
	await page.waitForNavigation();
	await page.screenshot({ path: 'authenticated.png', fullPage: true });

	let plugins = {};
	Object.keys(bot.config.plugins)
		.filter(plugin => bot.config.plugins[plugin].source.toLowerCase() === 'spigot')
		.forEach(plugin => plugins[plugin] = bot.config.plugins[plugin]);
		
	for (const plugin in plugins) {
		await page.goto(`https://www.spigotmc.org/resources/${plugins[plugin].resource}/updates`);
		
		let version;
		try {	
			// eslint-disable-next-line no-undef
			const url = await page.evaluate(() => document.querySelector('.downloadButton > a').href);
			version = (new URL(url)).searchParams.get('version');
			if (!version) {
				bot.log.warn(`Couldn't find a version number for ${plugin}`);
				continue;
			}
		} catch (e) {
			bot.log.error(e);
		}
		
	}	

	// await browser.close();	
};