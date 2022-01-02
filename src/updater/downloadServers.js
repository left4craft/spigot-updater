module.exports = async (bot) => {
	bot.log.info('Downloading servers');
	if (bot.config.server_jars_api.toLowerCase() === 'papermc')
		await require('../paper/download')(bot);
	else
		await require('../serverjars/download')(bot);
};