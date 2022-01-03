module.exports = async (bot) => {
	bot.log.info('Downloading plugins');
	await require('../spigot/download')(bot);
	await require('../bukkit/download')(bot);
	await require('../github/download')(bot);
	await require('../jenkins/download')(bot);
};