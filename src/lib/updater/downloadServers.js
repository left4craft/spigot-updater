module.exports = async (updateapi) => {
	updateapi.log.info('Downloading servers');
	if (updateapi.config.server_jars_api.toLowerCase() === 'papermc')
		await require('../paper/download')(updateapi);
	else
		await require('../serverjars/download')(updateapi);
};