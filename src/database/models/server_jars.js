const { DataTypes } = require('sequelize');

module.exports = {
	name: 'ServerJars',
	model: {
		type: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		version: DataTypes.STRING,
		latest: DataTypes.TEXT,
	}
};