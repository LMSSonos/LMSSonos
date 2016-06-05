///objects used to map LMS responses
export class Album {
    public ID: string;
    public Title: string;
    public Artist: string;
    public Artwork: string;
}

export class AlbumResult {
    public total: number;
    public Albums: Album[];
}

export class Track {
    public ID: string;
    public Title: string;
    public Artist: string;
    public Artwork: string;
    public TrackNumber: number;
    public Duration: number;

}

export class TrackResult {
    public total: number;
    public tracks: Track[];
}

export class Contributor {
    public ID: string;
    public ContributorName: string;
}

export class Genre {
    public ID: string;
    public Genre: string;
}

export class GenreResult {
    public total: number;
    public Genres: Genre[];
}

export class SearchResult {
    public Contributors: Contributor[];
}