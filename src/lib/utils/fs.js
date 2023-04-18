const fs = require('fs');
const { join } = require('path');
const unzipper = require('unzipper');

module.exports = {
	path: path => join(__dirname, '../../', path),
	unzip: (file, zip, output) => new Promise(resolve => {
		fs.createReadStream(zip)
			.pipe(unzipper.Parse())
			.on('entry', entry => {
				if (file instanceof RegExp) {
					if (file.test(entry.path)) {
						entry.pipe(fs.createWriteStream(output));
					} else {
						entry.autodrain();
					}
				} else {
					if (entry.path === file) {
						entry.pipe(fs.createWriteStream(output));
					} else {
						entry.autodrain();
					}
				}
			})
			.promise()
			.then(() => resolve());
	},)
};