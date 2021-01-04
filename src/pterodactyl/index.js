/**
 * @class Pterodactyl
 * @description Pterodactyl API class
 */

const fetch = require('node-fetch');
class Pterodactyl {
	/**
	 * @param {String} host The server address
	 * @param {String} key Your client API key
	 */
	constructor(host, key) {
		if (host[host.length - 1] !== '/') host += '/';
		this.host = host;
		this.key = key;
		this.client = this.host + 'api/client';
	}

	async post(endpoint, body) {
		return fetch(endpoint, {
			method: 'post',
			body: JSON.stringify(body),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.key}`,
			},
		});
	}

	/**
	 * @description Change the power state of a server
	 * @param {String} server The ID of the server you want to change
	 * @param {String} state The new power state
	 */
	async changePowerState(server, state) {
		let endpoint = `${this.client}/servers/${server}/power`;
		let response = await this.post(endpoint, {
			signal: state
		});
		// return await response.json();
		return response;
	}

	/**
	 * @description Stop a server
	 * @param {String} server The ID of the server you want to stop
	 */
	async stop(server) {
		return await this.changePowerState(server, 'stop');
	}

	/**
	 * @description Start a server
	 * @param {String} server The ID of the server you want to start
	 */
	async start(server) {
		return await this.changePowerState(server, 'start');
	}

}

module.exports = Pterodactyl;