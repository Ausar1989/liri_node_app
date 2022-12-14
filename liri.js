require("dotenv").config();
var keys = require("./keys.js");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);

//This variable is for the UI to input info in the terminal/bash.
const [node,file, ...args] = process.argv;

//This will be a function that will get music informantion from the spotify api.
function spotifyMusic(songName) {
    spotify.search({type: "track", query: songName, limit: 5}, function(err, data) {
        if (err) {
            console.log("We've got a problem" + err);
        }
        data.tracks.items.forEach(function(data) {
            console.log("");
            console.log(`Artist: ${data.artists[0].name}`); 
            console.log(`Song: ${songName}`);
            console.log(`Spotify Preview Link: ${data.preview_url}`);
            console.log(`Album: ${data.album.name}`);
        })
    })
};
//This Function will get movie information from the omdb api.
function searchMovie(movieName) {
    axios.get(`http://omdbapi.com/?t=${movieName}&apikey=trilogy`)
    .then(function(movie) {
        console.log("");
        console.log("Title: " + movie.data.Title);
        console.log(`Released: ${movie.data.Year}`);
        console.log(`IMDB Rating: ${movie.data.Ratings[0].Value}`);
        console.log(`Rotten Tomatoes Rating: ${movie.data.Ratings[1].Value}`);
        console.log(`Produced In: ${movie.data.Country}`);
        console.log(`Plot: ${movie.data.Plot}`);
        console.log(`Starring: ${movie.data.Actors}`);
        console.log(`Genre: ${movie.data.Genre}`);
        console.log(`Awards: ${movie.data.Awards}`)
    })
    .catch(function(err) {
        console.log(err);
    })
};
//This function will get movie information from the bandsintown api
function searchConcert(concertName) {
    axios.get(`https://rest.bandsintown.com/artists/${concertName}/events?app_id=codingbootcamp`)
    .then(function(concert) {
            console.log(`Venue: ${concert.data[0].venue.name}`);
            console.log(`City:  ${concert.data[0].formatted_location}`);
            console.log(moment(concert.data[0].datetime).format("MM/DD/YYYY"));
    })
    .catch(function(err) {
        console.log(err);
    })
};

//The rest of the code from here on. Are if-else statements about data
//froms specific api.
if(args[0] === "movie-this") {
    if(args[1] === undefined) {
        searchMovie("gigli");
    } 
    else {
      searchMovie(args.slice(1).join(" "));
    }
};

if(args[0] === "spotify-this-song") {
    if(args[1] === undefined) {
        spotifyMusic("never gonna give you up");
    }
    else {
        var spotifySong = args.slice(1).join("+");
        spotifyMusic(spotifySong);
    }
};

if(args[0] == "concert-this") {
    if(args[1] === undefined) {
        searchConcert("Bob+Dylan");
    }
    else {
        searchConcert(args.slice(1).join(""));
    }
};

if(args[0] === "read-this-file") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if(error) {
         return console.log(error);
        }
        
            var dataArr = data.split(",");
            if(dataArr[0] === "movie-this") {
                if(dataArr[1] === undefined) {
                    searchMovie("mission+impossible")
                }
                else {
                    searchMovie(dataArr[1].split().join("+"))
                }
            
        }

           if(dataArr[0] === "spotify-this-song") {
            if(dataArr[1] === undefined) {
                spotifyMusic("walk this way");
            }
            else {
                spotifyMusic(dataArr[1]);
            }
           }
    })
};

if (args[0] === "record-this") {
    fs.appendFile("log.txt", args[1] + ", ", function(err) {
        if(err) {
            return console.log(err);
        }
    })
}