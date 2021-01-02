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
	await page.waitForTimeout(5000);
	// await page.waitForNavigation();
	await page.screenshot({ path: 'loaded.png', fullPage: true });
	bot.log.console('Logging into SpigotMC');
	await page.type('#ctrl_pageLogin_login', process.env.SPIGOT_EMAIL); // , { delay: 100 } delay to make it more human-like
	await page.keyboard.press('Tab');
	await page.keyboard.type(process.env.SPIGOT_PASSWORD);
	// await page.type('#ctrl_pageLogin_password', process.env.SPIGOT_PASSWORD, { delay: 100 });
	await page.keyboard.press('Tab');
	await page.keyboard.press('Enter');
	await page.waitForNavigation();
	await page.screenshot({ path: 'authenticated.png', fullPage: true });

	let plugins = {};
	Object.keys(bot.config.plugins)
		.filter(plugin => bot.config.plugins[plugin].source.toLowerCase() === 'spigot')
		// .map(plugin => bot.config.plugins[plugin]);
		.forEach(plugin => plugins[plugin] = bot.config.plugins[plugin]);
		
	for (const plugin in plugins) {
		await page.goto(`https://www.spigotmc.org/resources/${plugins[plugin].resource}/updates`);
		
		let updateID;
		try {	
			updateID = await page.evaluate(() => {
				// eslint-disable-next-line no-undef
				let update = document.querySelector('.updateContainer > ol').firstElementChild;
				// return update.querySelector('h2 > a').href;
				return update.id.substring(7);
			});
		} catch (e) {
			bot.log.error(e);
		}
		
		// let version = (new URLSearchParams(url)).get('version');
		if (!updateID) {
			bot.log.warn(`Couldn't find a version number for ${plugin}`);
			continue;
		}
		console.log(updateID);
	}	
	// await browser.close();	
};