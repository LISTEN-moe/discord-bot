import { ConnectionManager } from 'typeorm';
import { Setting } from '../models/Settings';

const connectionManager = new ConnectionManager();
connectionManager.create({
	name: 'listen',
	type: 'postgres',
	url: process.env.DB,
	entities: [Setting],
});

export default connectionManager;
