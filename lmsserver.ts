/// This is the proxy that calls LMS rpc and maps it to objects to return it to sonos
import request = require('sync-request');
import { Config } from "./config";
import { Album } from "./lmsserverpocos";
import { AlbumResult } from "./lmsserverpocos";
import { Track } from "./lmsserverpocos";
import { Contributor } from "./lmsserverpocos";
import { SearchResult } from "./lmsserverpocos";
import { Genre } from "./lmsserverpocos";
import { GenreResult } from "./lmsserverpocos";

import { TrackResult } from "./lmsserverpocos";

var lmsUrl = Config.LMSUrl;
var lmsUrlRPC = lmsUrl + "/jsonrpc.js";
var playerMac = "player-mac";

export class LMSServer {

    public ListAlbumTracks(albumId: string): TrackResult {
        console.log("ListAlbumTracks albumId:" + albumId);
        var jsonData = '{"id":1,"method":"slim.request","params":["player-mac",["titles",0,20,"album_id:' + albumId + '","tags:ajytwdJ"]]}';

        var options = {
            body: jsonData
        }

        console.log(jsonData);

        var res = request('POST', lmsUrlRPC, options);
        var body = res.getBody('utf8');
        console.log(body);
        var result = new TrackResult();
        result.total = 0;
        result.tracks = [];

        JSON.parse(body).result.titles_loop.forEach(element => {
            var coverUrl = lmsUrl + "/music/" + element.artwork_track_id + "/cover.jpg";
            result.tracks.push({ ID: element.id, TrackNumber: element.tracknum, Title: element.title, Artist: element.artist, Artwork: coverUrl, Duration: Math.round(element.duration) });
        });

        if (JSON.parse(body).result.count != undefined) {
            result.total = JSON.parse(body).result.count;
        }


        return result;
    }

    public ListTrack(trackId: string): Track {
        var jsonData = '{"id":1,"method":"slim.request","params":["player-mac",["titles",0,20,"track_id:' + trackId + '","tags:ajytwdJ"]]}';

        var options = {
            body: jsonData
        }

        try {
            var res = request('POST', lmsUrlRPC, options);
            var body = res.getBody('utf8');
            //console.log(body);
            var tracks: Track[];
            tracks = [];

            if (JSON.parse(body).result.titles_loop != undefined) {
                JSON.parse(body).result.titles_loop.forEach(element => {
                    var coverUrl = lmsUrl + "/music/" + element.artwork_track_id + "/cover.jpg";
                    tracks.push({ ID: element.id, TrackNumber: element.tracknum, Title: element.title, Artist: element.artist, Artwork: coverUrl, Duration: Math.round(element.duration) });
                });
                return tracks[0];
            }
            else
                return null;
        }
        catch(exception)
        {
            console.log("ListtrackException: " + exception);
            return null;
        }
    }


    public SearchAlbum(index: number, count: number, term: string): AlbumResult {

        var jsonData = '{"id":1,"method":"slim.request","params":["player-mac",["albums",' + index + ',' + count + ',"' + term + '","tags:ajytw"]]}';

        var options = {
            body: jsonData
        }

        var res = request('POST', lmsUrlRPC, options);
        var body = res.getBody('utf8');
        console.log(body);
        var result = new AlbumResult();
        result.total = 0;
        result.Albums = [];

        if (JSON.parse(body).result.albums_loop != undefined) {
            JSON.parse(body).result.albums_loop.forEach(element => {
                var coverUrl = lmsUrl + "/music/" + element.artwork_track_id + "/cover.jpg";
                result.Albums.push({ ID: element.id, Title: element.title, Artist: element.artist, Artwork: coverUrl });
            });
        }

        if (JSON.parse(body).result.count != undefined) {
            result.total = JSON.parse(body).result.count;
        }

        return result;
    }

    public Search(index: number, count: number, term: string): SearchResult {


        var jsonData = '{"id":1,"method":"slim.request","params":["player-mac",["search",' + index + ',' + count + ',"term:' + term + '","tags:ajytw"]]}';

        var options = {
            body: jsonData
        }

        var res = request('POST', lmsUrlRPC, options);
        var body = res.getBody('utf8');
        console.log(body);
        var result = new SearchResult()
        result.Contributors = [];

        if (JSON.parse(body).result.contributors_loop != undefined) {
            JSON.parse(body).result.contributors_loop.forEach(element => {
                //var coverUrl = lmsUrl+"/music/"+element.artwork_track_id+"/cover.jpg";
                result.Contributors.push({ ID: element.contributor_id, ContributorName: element.contributor });
            });
        }

        console.log("done search");

        return result;
    }

    public Listalbums(index: number, count: number): AlbumResult {


        var jsonData = '{"id":1,"method":"slim.request","params":["player-mac",["albums",' + index + ',' + count + ',"sort:new","tags:ajytw"]]}';

        var options = {
            body: jsonData
        }

        var res = request('POST', lmsUrlRPC, options);
        var body = res.getBody('utf8');
        console.log(body);
        var result = new AlbumResult();
        result.Albums = [];
        result.total = 0;


        if (JSON.parse(body).result.albums_loop != undefined) {
            JSON.parse(body).result.albums_loop.forEach(element => {
                var coverUrl = lmsUrl + "/music/" + element.artwork_track_id + "/cover.jpg";
                result.Albums.push({ ID: element.id, Title: element.title, Artist: element.artist, Artwork: coverUrl });
            });
        }

        if (JSON.parse(body).result.count != undefined) {
            result.total = JSON.parse(body).result.count;
        }

        return result;
    }

    public ListGenres(index: number, count: number): GenreResult {


        var jsonData = '{"id":1,"method":"slim.request","params":["player-mac",["genres",' + index + ',' + count + ']]}';

        var options = {
            body: jsonData
        }

        var res = request('POST', lmsUrlRPC, options);
        var body = res.getBody('utf8');
        console.log(body);
        var result = new GenreResult();
        result.Genres = [];
        result.total = 0;


        if (JSON.parse(body).result.genres_loop != undefined) {
            JSON.parse(body).result.genres_loop.forEach(element => {
                result.Genres.push({ ID: element.id, Genre: element.genre });
            });
        }

        if (JSON.parse(body).result.count != undefined) {
            result.total = JSON.parse(body).result.count;
        }

        return result;
    }
}


