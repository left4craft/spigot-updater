const { DataTypes } = require('sequelize');

module.exports = {
	name: 'ServerJars',
	model: {
		id: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		type: DataTypes.STRING,
		version: DataTypes.STRING,
		approved_build: DataTypes.INTEGER, // build number (papermc) or build time (serverjars)
		latest_version: DataTypes.STRING,
		latest_build: DataTypes.INTEGER, // build number (papermc) or build time (serverjars)
		latest_changes: DataTypes.TEXT, // string to be parsed as JSON: [Object]
		latest_file: DataTypes.TEXT, // filename
		latest_checksum: DataTypes.STRING, // sha256 from papermc, md5 from serverjars
	}
};