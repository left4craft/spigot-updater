module.exports = {
	server_name: 'Left4Craft',
	color: '#C10053',
	channel_id: '731316455924039722',
	server_jars_api: 'papermc', // papermc | serverjars
	left4status: 'https://status.left4craft.org/', // optional
	headless_browser: true,
	no_sandbox_browser: false, // only change to true if you are getting errors or using docker
	cloudflare_timeout: 300000, // time to wait to pass cloudflare Javascript challenge
	download_time: 10000, // 10-15 seconds recommended, 5 seconds for Cloudflare
	save_logs: true,
	debug: false,
};