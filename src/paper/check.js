const fetch = require('node-fetch');
const servers = require('../../config/servers');

module.exports = async bot => {

	const API = 'https://papermc.io/api/v2/projects';
	

	// this is just a check
	let valid = (await (await fetch(API)).json()).projects;
	if (valid instanceof Array) { // if there isn't an error above
		for (let s in servers) {
			let type = servers[s].jar.type;
			if (!valid.includes(type))
				bot.log.warn(`${s} server has an unsupported jar type: '${type}'.
			Supported jar types for PaperMC API: ${valid.join(', ')}.
			Switch to server_jars_api to 'serverjars' in the config for more jar types.`);
		}
	}
	
	// get an array of server jar types and make a Set to reduce the number of API calls
	let projects = new Set(Object.keys(servers).map(s => servers[s].jar.type));
	for (let p of projects) {
		// versions of each project
		let versions = new Set(
			Object.keys(servers)
				.filter(s => servers[s].jar.type === p)
				.map(s => servers[s].jar.version)
		);

		for (let v of versions) {
			console.log(p, v);
		}
	}
};