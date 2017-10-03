const Sequelize = require('sequelize');
const path = require('path');
const pino = require('pino')({ prettyPrint: true });

const sqlite = new Sequelize({
	dialect: 'sqlite',
	storage: path.join(__dirname, 'listen.db'),
	logging: false,
	define: { timestamps: false },
	operatorsAliases: false
});

class Database {
	static get db() {
		return sqlite;
	}

	static start() {
		return sqlite.authenticate()
			.then(() => pino.info('[SQLITE][AUTH]: Connection to database has been established successfully.'))
			.then(() => sqlite.sync(process.env.NODE_ENV === 'migration' ? {} : {})
				.catch(error => {
					pino.error(`[SQLITE][ERROR]: Error synchronizing the database:\n${error}`);
					setTimeout(() => Database.start(), 5000);
				}))
			.then(() => pino.info('[SQLITE][AUTH]: Synchronizing database done!'))
			.catch(err => {
				pino.error(`[SQLITE][AUTH]: Unable to connect to the database:\n${err}`);
				setTimeout(() => Database.start(), 5000);
			});
	}
}

module.exports = Database;
