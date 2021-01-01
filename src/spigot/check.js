const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

module.exports = async bot => {

	const browser = await puppeteer.launch({
		headless: bot.config.headless_browser,
		args: [
			'--proxy-server=\'direct://\'',
			'--proxy-bypass-list=*'
		]
	});

	const page = await browser.newPage();
	
};