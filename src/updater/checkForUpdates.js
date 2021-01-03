
module.exports = async (bot) => {
	bot.log.console('Checking for server jar updates');
	if (bot.config.server_jars_api.toLowerCase() === 'papermc')
		await require('../paper/check')(bot);
	else
		await require('../serverjars/check')(bot);
	
	
	bot.log.console('Checking for plugin updates');
	await require('../spigot/check')(bot);
	await require('../github/check')(bot);
	await require('../jenkins/check')(bot);
};