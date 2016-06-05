/// this is the main server file, contains the bindings for the calls and the mappings
var soap = require('soap-server');
import {Config} from "./config";
import {LMSServer} from "./lmsserver";
import {Album} from "./lmsserverpocos";
import {AlbumResult} from "./lmsserverpocos";
import {Track} from "./lmsserverpocos";
import {TrackResult} from "./lmsserverpocos";
import {Contributor} from "./lmsserverpocos";
import {SearchResult} from "./lmsserverpocos";
import {TrackMetadata} from "./sonospocos";
import {AbstractMedia} from "./sonospocos";
import {MediaCollectionEntry} from "./sonospocos";
import {mediaList} from "./sonospocos";
import {lastUpdate} from "./sonospocos";
import {Genre} from "./lmsserverpocos";
import {GenreResult} from "./lmsserverpocos";


class SonosService {
	public getLastUpdate() {
		var res = new lastUpdate();
		res.pollInterval = 5;
		return res;
	}

	public testField: mediaList;

	public getMetadata(id: string, index: number, count: number): mediaList {
		var lms = new LMSServer();
		if (id.indexOf("album-") == 0) {
			let lmsResult: TrackResult = lms.ListAlbumTracks(id.substr(6));
			return this.convertTrackResult(lmsResult);
		}
		else if (id.indexOf("genre-") == 0) {
			let lmsResult = lms.SearchAlbum(index, count, "genre_id:" + id.substr(6));
			return this.convertAlbumResult(lmsResult);
		}
		else if (id.indexOf("contributor-") == 0) {
			let lmsResult = lms.SearchAlbum(index, count, "artist_id:" + id.substr(12));
			return this.convertAlbumResult(lmsResult);
		}
		else if (id == "newmusic") {
			let lmsResult = lms.Listalbums(index, count);
			return this.convertAlbumResult(lmsResult);
		}
		else if (id == "genres") {
			let lmsResult = lms.ListGenres(index, count);
			return this.converGenreResult(lmsResult);
		}
		else {
			//root menu
			var albums: Album[] = [];

			var response = new mediaList();
			response.index = 0;
			response.count = 2;
			response.total = 2;
			response.mediaCollection = [];

			var abs1 = new MediaCollectionEntry();
			abs1.id = "newmusic"
			abs1.title = "New music";
			abs1.itemType = "collection";
			abs1.displayType = "gridAlbum";
			response.mediaCollection.push(abs1)

			var abs2 = new MediaCollectionEntry();
			abs2.id = "genres"
			abs2.title = "Genre";
			response.mediaCollection.push(abs2)
			return response;
		}
	}

	htmlEntities(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	safeArtist(str: string) {
		return this.safeLenght(str, 64);
	}

	safeTitle(str: string) {
		return this.safeLenght(str, 64);
	}

	safeLenght(str: string, maxLenght: number) {
		if (str == undefined)
			return "";
		else if (str.length > maxLenght)
			str = str.substr(0, maxLenght);

		return this.htmlEntities(str);
	}


	public getMediaMetadata(id: string) {

		var lms = new LMSServer();
		var track: Track = lms.ListTrack(id.substr(6));
		var res = new AbstractMedia();
		res.id = id;
		res.title = this.safeTitle(track.Title);
		res.itemType = "track";
		res.genre = "Pop meta";
		res.mimeType = "audio/flac";
		//res.artist = this.safeArtist(track.Artist);
		res.trackMetadata = new TrackMetadata();
		res.trackMetadata.artist = this.safeArtist(track.Artist);
		res.trackMetadata.duration = track.Duration;
		res.trackMetadata.albumArtURI = track.Artwork
		res.trackMetadata.genre = "Pop meta";
		res.trackMetadata.albumArtist = this.safeArtist(track.Artist);
		res.trackMetadata.id = id;
		return res;
	}

	public getExtendedMetadata(id: string) {
		var lms = new LMSServer();
		var track: Track = lms.ListTrack(id.substr(6));
		var res = new AbstractMedia();
		res.id = id;
		res.title = this.safeTitle(track.Title);
		res.itemType = "track";
		res.genre = "Pop meta";
		res.mimeType = "audio/flac";
		res.artist = this.safeArtist(track.Artist);
		res.trackMetadata = new TrackMetadata();
		res.trackMetadata.artist = this.safeArtist(track.Artist);
		res.trackMetadata.duration = track.Duration;
		res.trackMetadata.albumArtURI = track.Artwork
		res.trackMetadata.genre = "Pop meta";
		res.trackMetadata.albumArtist = this.safeArtist(track.Artist);
		res.trackMetadata.id = id;
		return res;
	}

	public getMediaURI(id: string) {
		var finalId = id.substr(6);
		return "http://192.168.178.139:9002/music/" + finalId + "/download/01.%20White%20Room.flac";
	}

	public search(id: string, term: string, index: number, count: number): mediaList {
		var lms = new LMSServer();
		var response = new mediaList();

		if (id == "album") {
			let lmsResult = lms.SearchAlbum(index, count, "term:" + term);
			return this.convertAlbumResult(lmsResult);
		}
		else if (id == "artist") {

			var result = lms.Search(index, count, term);
			response.index = 0;
			response.count = result.Contributors.length;
			response.total = result.Contributors.length;
			response.mediaCollection = [];
			result.Contributors.forEach(element => {
				var abs1 = new MediaCollectionEntry();
				abs1.id = "contributor-" + element.ID;
				abs1.title = this.safeTitle(element.ContributorName);
				abs1.itemType = "collection";
				abs1.displayType = "gridAlbum";
				//abs1.mimeType = "audio/flac";
				//abs1.albumArtURI = album.Artwork;
				response.mediaCollection.push(abs1)
			});
			return response;
		}
		else {
			//dummy
			response.index = 0;
			response.count = 0;
			response.total = 0;
			response.mediaCollection = [];
			return response;
		}
	}

	private convertAlbumResult(albumResult: AlbumResult): mediaList {
		let response = new mediaList();
		response.index = 0;
		response.count = albumResult.Albums.length;
		response.total = albumResult.total;
		response.mediaCollection = [];
		albumResult.Albums.forEach(album => {
			var abs1 = new MediaCollectionEntry();
			abs1.id = "album-" + album.ID;
			//abs1.displayType="gridAlbum";
			abs1.title = this.safeTitle(album.Title);
			abs1.artist = this.safeArtist(album.Artist);
			abs1.itemType = "album";
			abs1.mimeType = "audio/flac";
			abs1.albumArtURI = album.Artwork;
			abs1.canPlay = true;
			abs1.canAddToFavorites = true;
			abs1.trackMetadata = new TrackMetadata();
			abs1.displayType = "defaultLine";

			//abs1.trackMetadata.albumArtURI = album.Artwork;

			//abs1.trackMetadata.duration = 12;
			response.mediaCollection.push(abs1);
		});

		return response;
	}

	private convertTrackResult(trackResult: TrackResult): mediaList {
		let response = new mediaList();
		response.count = trackResult.tracks.length;
		response.total = trackResult.total;
		response.mediaMetadata = [];
		trackResult.tracks.forEach(track => {
			var abs1 = new AbstractMedia();
			abs1.id = "track-" + track.ID;
			abs1.title = this.safeTitle(track.Title);
			abs1.artist = this.safeArtist(track.Artist);
			abs1.itemType = "track";
			abs1.mimeType = "audio/flac";
			abs1.displayType = "defaultLine";

			abs1.trackMetadata = new TrackMetadata();
			abs1.trackMetadata.albumArtURI = track.Artwork;
			abs1.trackMetadata.duration = track.Duration;
			abs1.trackMetadata.albumArtist = this.safeArtist(track.Artist);
			abs1.trackMetadata.artist = this.safeArtist(track.Artist);
			response.mediaMetadata.push(abs1);
		});
		return response;
	}

	private converGenreResult(genreResult: GenreResult): mediaList {
		var response = new mediaList();
		response.index = 0;
		response.count = genreResult.Genres.length;
		response.total = genreResult.total;
		response.mediaCollection = [];
		genreResult.Genres.forEach(genre => {
			var abs1 = new MediaCollectionEntry();
			abs1.id = "genre-" + genre.ID;
			abs1.displayType = "gridAlbum";
			abs1.title = this.safeTitle(genre.Genre);
			abs1.itemType = "genre";
			abs1.canPlay = false;
			abs1.canAddToFavorites = false;
			abs1.trackMetadata = new TrackMetadata();
			response.mediaCollection.push(abs1);
		});

		return response;
	}

}




var soapServer = new soap.SoapServer();
var soapService = soapServer.addService('service1.svc', new SonosService());
soapServer.listen(Config.LocalPortToBind, Config.LocalIPToBind);


