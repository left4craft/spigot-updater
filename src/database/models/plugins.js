const { DataTypes } = require('sequelize');

module.exports = {
	name: 'Plugins',
	model: {
		name: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		approved: DataTypes.STRING,
	}
};