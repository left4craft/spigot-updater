module.exports = async (bot) => {
	bot.log.info('Downloading plugins');
	try {
		await require('../spigot/download')(bot);
	} catch (e) {
		console.warn('Error downloading from spigot');
		console.error(e);
	}
	
	try {
		await require('../github/download')(bot);
	} catch (e) {
		console.warn('Error downloading from github');
		console.error(e);
	}

	try {
		await require('../jenkins/download')(bot);
	} catch (e) {
		console.warn('Error downloading from jenkins');
		console.error(e);
	}
};