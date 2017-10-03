const pino = require('pino')({ prettyPrint: true });

class Logger {
	trace(...args) {
		return pino.trace(...args);
	}

	debug(...args) {
		return pino.debug(...args);
	}

	info(...args) {
		return pino.info(...args);
	}

	warn(...args) {
		return pino.warn(...args);
	}

	error(...args) {
		return pino.error(...args);
	}

	fatal(...args) {
		return pino.fatal(...args);
	}
}

module.exports = Logger;
