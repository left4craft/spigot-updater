const { DataTypes } = require('sequelize');

module.exports = {
	name: 'ServerJars',
	model: {
		id: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		type: {
			type: DataTypes.STRING,
			// primaryKey: true
		},
		version: {
			type: DataTypes.STRING,
			// primaryKey: true
		},
		latest_version: DataTypes.STRING,
		latest_build: DataTypes.INTEGER,
		latest_changes: DataTypes.TEXT,
		latest_file: DataTypes.TEXT,
		latest_checksum: DataTypes.STRING,
	}
};