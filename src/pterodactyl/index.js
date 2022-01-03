const HTTP = require('./http');

/**
 * @class Pterodactyl
 * @description Pterodactyl API class
 */
class Pterodactyl {
	/**
	 * @param {String} host The server address
	 * @param {String} key Your client API key
	 */
	constructor(host, key) {
		if (host[host.length - 1] !== '/')
			host += '/';
		this.host = host;
		this.key = key;
		this.client = this.host + 'api/client';
		this.http = new HTTP(this.key);
	}

	/**
	 * @description Get the power state of a server
	 * @param {String} server The ID of the server you want to check
	 */
	async getPowerState(server) {
		let endpoint = `${this.client}/servers/${server}/resources`;
		let response = await this.http.getJSON(endpoint);
		response = await response.json();
		return response.attributes.current_state;
	}
	
	/**
	 * @description Change the power state of a server
	 * @param {String} server The ID of the server you want to change
	 * @param {String} state The new power state
	 */
	async changePowerState(server, state) {
		let endpoint = `${this.client}/servers/${server}/power`;
		let response = await this.http.postJSON(endpoint, {
			signal: state
		});
		// return await response.json();
		return response;
	}

	/**
	 * @description Kill a server
	 * @param {String} server The ID of the server you want to kill
	 */
	async kill(server) {
		return await this.changePowerState(server, 'kill');
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

	/**
	 * @description Upload a file
	 * @param {String} server The ID of the server you want to upload to
	 * @param {String} path The remote file path
	 * @param {Array} files Array of file paths
	 */
	async upload(server, path, files) {
		let endpoint = `${this.client}/servers/${server}/files/upload`;
		let response = await this.http.getJSON(endpoint); // make GET request
		response = await response.json();
		console.log(response);
		let url = new URL(response.attributes.url); // create a URL object from the string
		let params = new URLSearchParams(url.search); // create a URLSearchParams object from the URL's params string
		params.set('directory', path); // set the directory param
		url.search = params.toString(); // update the URL's params
		url = url.toString(); // finished manipulating the URL, turn it back into a string

		return await this.http.uploadFiles(url, files);
	}

}

module.exports = Pterodactyl;