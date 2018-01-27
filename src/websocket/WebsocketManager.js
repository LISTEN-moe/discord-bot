const Websocket = require('ws');

class WebsocketManager {
	constructor(client) {
		this.client = client;
		this.ws = null;
		this.sendHeartbeat = null;
	}

	connect() {
		if (this.ws) this.ws.removeAllListeners();
		try {
			this.ws = new Websocket(this.client.options.websocket);
		} catch (error) {
			setTimeout(this.connect.bind(this), 5000);
		}

		this.ws.on('open', this.onOpen.bind(this));
		this.ws.on('message', this.onMessage.bind(this));
		this.ws.on('close', this.onClose.bind(this));
		this.ws.on('error', this.client.logger.error);
	}

	heartbeat(websocket, ms) {
		this.sendHeartbeat = setInterval(() => {
			this.ws.send(JSON.stringify({ op: 9 }));
		}, ms);
	}

	onOpen() {
		clearInterval(this.sendHeartbeat);
		this.ws.send(JSON.stringify({ op: 0, d: { auth: '' } }));
	}

	onMessage(data) {
		if (!data.length) return;
		try {
			var response = JSON.parse(data);
		} catch (error) {
			this.client.logger.error(error);
			return;
		}
		if (response.op === 0) return this.heartbeat(this.ws, response.d.heartbeat); // eslint-disable-line
		if (response.op === 1) {
			if (response.t !== 'TRACK_UPDATE' && response.t !== 'TRACK_UPDATE_REQUEST') return;

			let artists = null;
			if (response.d.song.artists.length) {
				artists = response.d.song.artists.map(elem => elem.nameRomaji || elem.name).join(', ');
			}

			let requester = '';
			if (response.d.requester) {
				requester = `[${response.d.requester.displayName}](https://listen.moe/u/${response.d.requester.username})`;
			}

			let source = '';
			if (response.d.song.sources.length) {
				source = response.d.song.sources[0].nameRomaji || response.d.song.sources[0].name;
			}

			this.client.radioInfo = {
				songName: response.d.song.title,
				artistName: artists,
				sourceName: source,
				listeners: response.d.listeners,
				requestedBy: requester,
				event: false,
				eventName: null
			};
			this.currentSongGame();
		}
	}

	onClose() {
		clearInterval(this.sendHeartbeat);
		setTimeout(this.connect.bind(this), 5000);
	}

	currentSongGame() {
		let game = 'Loading data...';
		if (Object.keys(this.client.radioInfo).length) {
			game = `${this.client.radioInfo.artistName} - ${this.client.radioInfo.songName}`;
		}
		this.client.user.setActivity(game);
	}
}

module.exports = WebsocketManager;
