import * as WebSocket from 'ws';
import ListenClient from '../client/ListenClient';

export default class WebSocketManager {
	private ws: WebSocket | null = null;

	private sendHeartbeat: NodeJS.Timer | null = null;

	public constructor(public readonly client: ListenClient, public readonly url: string, public readonly type: string) {}

	public connect() {
		if (this.ws) this.ws.removeAllListeners();
		try {
			this.ws = new WebSocket(this.url);
		} catch (error) {
			this.client.setTimeout(this.connect.bind(this), 5000);
		}

		this.ws!.on('open', this.onOpen.bind(this));
		this.ws!.on('message', this.onMessage.bind(this));
		this.ws!.on('close', this.onClose.bind(this));
		this.ws!.on('error', this.client.logger.error);
	}

	private heartbeat(ms: number) {
		this.sendHeartbeat = this.client.setInterval(() => {
			this.ws!.send(JSON.stringify({ op: 9 }));
		}, ms);
	}

	private onOpen() {
		this.client.clearInterval(this.sendHeartbeat!);
		this.ws!.send(JSON.stringify({ op: 0, d: { auth: '' } }));
	}

	private onMessage(data: any) {
		if (!data.length) return;
		let response;
		try {
			response = JSON.parse(data);
		} catch (error) {
			this.client.logger.error(error);
			return;
		}

		if (response.op === 0) return this.heartbeat(response.d.heartbeat);
		if (response.op === 1) {
			if (response.t !== 'TRACK_UPDATE' && response.t !== 'TRACK_UPDATE_REQUEST') return;

			let artist = null;
			if (response.d.song.artists.length) {
				artist = response.d.song.artists.map((elem: { name: string, nameRomaji: string }) => elem.nameRomaji || elem.name).join(', ');
			}

			let artists = null;
			if (response.d.song.artists.length) {
				artists = response.d.song.artists.map((elem: { id: number, name: string, nameRomaji: string }) => {
					if (elem.nameRomaji) {
						return `[${elem.nameRomaji}](https://listen.moe/music/artists/${elem.id})`;
					}
					return `[${elem.name}](https://listen.moe/music/artists/${elem.id})`;
				}).join(', ');
			}

			let requester = '';
			if (response.d.requester) {
				requester = `[${response.d.requester.displayName}](https://listen.moe/u/${response.d.requester.username})`;
			}

			let source = '';
			if (response.d.song.sources.length) {
				source = response.d.song.sources[0].nameRomaji || response.d.song.sources[0].name;
			}

			let album = '';
			if (response.d.song.albums && response.d.song.albums.length > 0) {
				album = `[${response.d.song.albums[0].name}](https://listen.moe/music/albums/${response.d.song.albums[0].id})`;
			}

			let cover = 'https://listen.moe/public/images/icons/android-chrome-192x192.png';
			if (response.d.song.albums && response.d.song.albums.length > 0 && response.d.song.albums[0].image) {
				cover = `https://cdn.listen.moe/covers/${response.d.song.albums[0].image}`;
			}

			let event = false;
			let eventName = null;
			let eventCover = null;
			if (response.d.event) {
				event = true;
				eventName = response.d.event.name;
				eventCover = response.d.event.image;
			}

			if (this.type === 'kpop') {
				this.client.radioInfoKpop = {
					songName: response.d.song.title,
					artistName: artist,
					artistList: artists,
					artistCount: response.d.song.artists.length,
					sourceName: source,
					albumName: album,
					albumCover: cover,
					listeners: response.d.listeners,
					requestedBy: requester,
					event,
					eventName,
					eventCover
				};
			} else {
				this.client.radioInfo = {
					songName: response.d.song.title,
					artistName: artist,
					artistList: artists,
					artistCount: response.d.song.artists.length,
					sourceName: source,
					albumName: album,
					albumCover: cover,
					listeners: response.d.listeners,
					requestedBy: requester,
					event,
					eventName,
					eventCover
				};
			}

			this.currentSongGame();
		}
	}

	private onClose() {
		this.client.clearInterval(this.sendHeartbeat!);
		this.client.setTimeout(this.connect.bind(this), 5000);
	}

	private currentSongGame() {
		if (this.type === 'kpop') return;
		let game = 'Loading data...';
		if (Object.keys(this.client.radioInfo!).length) {
			game = `${this.client.radioInfo!.artistName} - ${this.client.radioInfo!.songName}`;
		}
		this.client.user!.setActivity(game);
	}
}
