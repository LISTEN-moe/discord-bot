import { createLogger, transports, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export const logger = createLogger({
	format: format.combine(
		format.errors({ stack: true }),
		format.label({ label: 'BOT' }),
		format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
		format.printf((info: any): string => {
			const { timestamp, label, level, message, ...rest } = info;
			return `[${timestamp}][${label}][${level.toUpperCase()}]: ${message}${
				Object.keys(rest).length ? `\n${JSON.stringify(rest, null, 2)}` : ''
			}`;
		}),
	),
	transports: [
		new transports.Console({
			format: format.colorize({ level: true }),
			level: 'info',
		}),
		new DailyRotateFile({
			format: format.combine(format.timestamp(), format.json()),
			level: 'debug',
			filename: 'listen-%DATE%.log',
			maxFiles: '14d',
		}),
	],
});
