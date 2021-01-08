const fetch = require('node-fetch');
const FormData = require('form-data');

/**
 * @class HTTP
 * @description HTTP helper class
 */
class HTTP {
	/**
	 * @param {String} key Your client API key
	 */
	constructor(key) {
		this.key = key;
	}
	
	/**
	 * @description POST JSON data
	 * @param {String} endpoint The URL
	 * @param {Object} body JSON object to POST
	 */
	async postJSON(endpoint, body) {
		return fetch(endpoint, {
			method: 'post',
			body: JSON.stringify(body),
			headers: {
				// 'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.key}`,
			},
		});
	}

	/**
	 * @description GET JSON data
	 * @param {String} endpoint The URL
	 * @param {Object} body JSON object to GET
	 */
	getJSON(endpoint) {
		return fetch(endpoint, {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.key}`,
			},
		});
	}

	/**
	 * @description POST a file
	 * @param {String} endpoint The URL
	 * @param {Object} file File to upload
	 */
	uploadFile(endpoint, file) {
		const form = new FormData();
		form.append('files', file);
		return fetch(endpoint, {
			method: 'POST',
			body: form,
			headers: form.getHeaders()
		});
	}
}
module.exports = HTTP;