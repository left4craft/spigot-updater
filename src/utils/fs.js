const { join } = require('path');

module.exports = {
	path: path => join(__dirname, '../../', path),
	unzip: async (name, zip, file) => {
		name, zip, file;
	},
};