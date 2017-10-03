const Websocket = require('ws');

class WebsocketManager {
	constructor(client) {
		this.client = client;
		this.ws = null;
	}

	connect() {
		if (this.ws) this.ws.removeAllListeners();
		try {
			this.ws = new Websocket(this.client.options.websocket);
		} catch (error) {
			setTimeout(this.connect.bind(this), 5000);
		}

		this.ws.on('message', this.onMessage.bind(this));
		this.ws.on('close', this.onClose.bind(this));
		this.ws.on('error', this.client.logger.error);
	}

	onMessage(data) {
		try {
			if (!data) return;
			const parsed = JSON.parse(data);
			this.client.radioInfo = {
				songName: parsed.song_name,
				artistName: parsed.artist_name,
				animeName: parsed.anime_name,
				listeners: parsed.listeners,
				requestedBy: parsed.requested_by
			};
			this.currentSongGame();
		} catch (error) {
			this.client.logger.error(error);
		}
	}

	onClose() {
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
