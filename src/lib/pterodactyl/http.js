const fs = require('fs');
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
	postJSON(endpoint, body) {
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
	 * @param {Array} files Files to upload
	 */
	uploadFiles(endpoint, files) {
		const form = new FormData();
		for (let f of files) {
			if(!fs.existsSync(f)) {
				console.log(`Warning: path ${f} does not exist!`)
				continue
			}
			form.append('files', fs.createReadStream(f));
		}
		return fetch(endpoint, {
			method: 'POST',
			body: form,
			headers: form.getHeaders()
		});
	}
}
module.exports = HTTP;