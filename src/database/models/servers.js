const { DataTypes } = require('sequelize');

module.exports = {
	name: 'Servers',
	model: {
		name: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		current: DataTypes.STRING,
	}
};