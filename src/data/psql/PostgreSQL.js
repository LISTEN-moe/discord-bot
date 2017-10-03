const Sequelize = require('sequelize');
const pino = require('pino')({ prettyPrint: true });

const { DB } = require(`../../util/constants.${process.env.NODE_ENV || 'development'}`);
const psql = new Sequelize(DB, {
	logging: false,
	define: { timestamps: false },
	operatorsAliases: false
});

class Database {
	static get db() {
		return psql;
	}

	static start() {
		return psql.authenticate()
			.then(() => pino.info('[PSQL][AUTH]: Connection to database has been established successfully.'))
			.then(() => psql.sync(process.env.NODE_ENV === 'migration' ? {} : {})
				.catch(error => {
					pino.error(`[PSQL][ERROR]: Error synchronizing the database:\n${error}`);
					setTimeout(() => Database.start(), 5000);
				}))
			.then(() => pino.info('[PSQL][AUTH]: Synchronizing database done!'))
			.catch(err => {
				pino.error(`[PSQL][AUTH]: Unable to connect to the database:\n${err}`);
				setTimeout(() => Database.start(), 5000);
			});
	}
}

module.exports = Database;
