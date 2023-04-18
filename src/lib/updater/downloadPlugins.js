module.exports = async (updateapi) => {
	updateapi.log.info('Downloading plugins');
	try {
		await require('../spigot/download')(updateapi);
	} catch (e) {
		console.warn('Error downloading from spigot');
		console.error(e);
	}

	try {
		await require('../bukkit/download')(updateapi);
	} catch (e) {
		console.warn('Error downloading from github');
		console.error(e);
	}


	try {
		await require('../github/download')(updateapi);
	} catch (e) {
		console.warn('Error downloading from github');
		console.error(e);
	}

	try {
		await require('../jenkins/download')(updateapi);
	} catch (e) {
		console.warn('Error downloading from jenkins');
		console.error(e);
	}
};