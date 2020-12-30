const fs = require('fs');
const { path } = require('../utils/fs');

const { capitalise } = require('../utils');

const {
	Sequelize,
	Model
} = require('sequelize');

module.exports = log => {
	log.info('Connecting to database');

	const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
		dialect: 'mysql',
		host: process.env.DB_HOST,
		logging: log.debug
	});
	/* const sequelize = new Sequelize({
		dialect: 'sqlite',
		storage: './database.sqlite',
		logging: log.debug
	}); */

	let models = {};
	let files = fs.readdirSync(path('src/database/models/')).filter(file => file.endsWith('.js'));
	for (let file of files) {
		let model = require(`./models/${file}`);
		class AModel extends Model { }
		AModel.init(model.model, {
			sequelize,
			modelName: model.name
		});
		AModel.sync({
			alter: false
		});
		models[model.name] = AModel;
	}

	return models;

};
