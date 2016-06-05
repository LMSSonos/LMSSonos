//sonos responses
export class lastUpdate
{
	
	public catalog : string;
	public favorites : string;
	//The length of time in seconds that the player should wait before polling the service again. This can be from 30 to 86400 seconds.
	public pollInterval : number;
}

export class mediaList
{
	public index : number;
	public count : number;
	public total : number;
	public mediaMetadata : AbstractMedia[];
	public mediaCollection : AbstractMedia[];
	
		
}

//http://musicpartners.sonos.com/node/83
//not really used as abstract, sorry ;-)
export class AbstractMedia
{
	public id : string;
	public itemType; //enum
	public displayType : string;
	public title: string;
	public mimeType : string;
	public summary : string;
	public isFavorite : boolean;
	public isFavoriteSpecified: boolean;
	public languange : string;
	public country : string;
	public genre : string;
	public twitterId : string;
	public liveNow : boolean;
	public liveNowSpecified : boolean;
	public onDemand : boolean;
	public onDemandSpecified : boolean; 
	public trackMetadata : TrackMetadata;
	public artist : string;
}

export class MediaCollectionEntry extends AbstractMedia
{
	public albumArtURI : string;
	public canPlay : boolean;
	public canAddToFavorites : boolean;
	public albumArtist : string;
}

export class TrackMetadata
{
	public id : string;
	public duration : number;
	public artistId : string;
	public genre : string;
	public artist : string;
	public album: string;
	public albumArtURI : string;
	public albumArtist : string;
}