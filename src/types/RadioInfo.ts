export interface RadioInfo {
	songName: string;
	artistName?: string;
	artistList?: string;
	artistCount: number;
	sourceName: string;
	albumName: string;
	albumCover: string;
	listeners: number;
	requestedBy: string;
	event: boolean;
	eventName?: string;
	eventCover?: string;
}

export interface RadioInfoKpop extends RadioInfo {}
