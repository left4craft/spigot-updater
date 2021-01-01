const { DataTypes } = require('sequelize');

module.exports = {
	name: 'Plugins',
	model: {
		name: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		current: DataTypes.STRING,
		approved: DataTypes.STRING,
	}
};