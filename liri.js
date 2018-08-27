require("dotenv").config();
// requires these from npm to run the program 
var Spotify = require('node-spotify-api');
var moment = require('moment');
var keys = require('./keys.js');
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
// creates a new spotify to find songs 
// request required to get data from API's
var request = require("request");
var com1 = process.argv[2];
var nodeArgs = process.argv;
// com1 is the pretty much what the user wants to do 
// then nodeArgs takes the input to perform one of the functions from com1
var artist = "";
var song2 = "";
var songs = "";
var movies = "";
// if statements to direct to functions if typed
if(com1 == "concert-this")
{
    concert();
}
else if(com1 == "spotify-this-song")
{ 
    song();
}
else if(com1 == "movie-this")
{
    movie();
}
else if(com1 == "do-what-it-says")
{
   doWhat();
}
else 
{
    console.log(" ");
}
// all the functions loop through nodeArgs to include a '+' sign everytime there is a space to merge it
function concert()
{
for(var i=3;i<nodeArgs.length;i++)
{
    if(i>3 && i<nodeArgs.length)
    {
        artist = artist + "+" + nodeArgs[i];
    }
    else 
    {
        artist += nodeArgs[i];
    }
}
// this is basic api without ajax
var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
// sends a request to the api to get back data or errors 
console.log(" ");
request(queryUrl, function(error, response, body)
{
    if (error) {
        console.log(error);
      }
    // Note: if need more than one events displayed, a loop can be added here 
    // otherwise this shows the first event and prints the name, city, and data using moment to format it. 
      console.log("Venue: " + JSON.parse(body)[0].venue.name);
      console.log("Location: " + JSON.parse(body)[0].venue.city, JSON.parse(body)[0].venue.country);
      var time = JSON.parse(body)[0].datetime; 
      console.log("Date of Event: " + moment(time).format("MM/DD/YYYY"));
})
}

function song()
{
    
    for(var i=3;i<nodeArgs.length;i++)
    {
        if(i>3 && i<nodeArgs.length)
        {
            songs = songs + "+" + nodeArgs[i];
            
        }
        else 
        {
            songs += nodeArgs[i];
        }
    }
    // this functions uses spotify search to find songs and return the data.
    // if i used request there is an issue with getting a token so this was the best option
    spotify.search({type:'track', query: songs}, function(error, data)
    {
        console.log(" ");
        console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        // i added this in because some of the songs do not have a preview link
        // in that case i used a external url that goes to the album with all the songs 
        if(data.tracks.items[0].preview_url === null)
        {
            console.log("No Preview Link but heres the album link: " + data.tracks.items[0].external_urls.spotify)
        }
        else 
        {
            console.log("Preview link: " + data.tracks.items[0].preview_url)
        }
        console.log("Name of album: " + data.tracks.items[0].album.name);
    })
}

function movie()
{
    for(var i = 3; i<nodeArgs.length; i++)
    {
        if(i>3 && i<nodeArgs.length)
        {
            movies = movies + "+" + nodeArgs[i];
        }
        else
        {
            movies += nodeArgs[i];
        }
    }
    // same as the bands in town api 

    var queryUrl = "http://www.omdbapi.com/?t=" + movies + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response,body)
    {
        if (error) {
            console.log(error);
          }
          console.log(" ");
        // this sends a request to the api and returns the body with various info about the movie
        console.log("Movie Title: " + JSON.parse(body).Title);
        console.log("Year the movie came out: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
        console.log("Country Movie Made: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
    })

}

function doWhat()
{
    // this function reads the file without changing it and returns data
    fs.readFile("random.txt", "utf8", function(error, data)
    {
        if(error)
        {
            console.log(error);
        }
        // since it would be difficult to select only the characters needed, i turns the data into an array with split
        // then seperated them in x and y 
        var whole = data.split(',');
        var x = whole[0];
        var y = whole[1];
        // since y had quotes and was not working with the loop as the previous functions
        // i used replace to get rid of the quotes and the a loop to add '+' signs in every space
        // otherwise I could have used split and join and it would have worked the same. 
        var z = y.replace(/\"/g, "");
        for(var i=0;i<z.length;i++)
        {
             z = z.replace(" ", "+")
        }
        song2 = z;
        // var t = z.split(' ').join('+');
        // console.log(t);
        

        spotify.search({type:'track', query: song2}, function(error, data)
        {
            // after the song2 is readable then it the same spotify function
            console.log(" ");
            console.log("Song Name: " + data.tracks.items[0].name);
            if(data.tracks.items[0].preview_url === null)
            {
                console.log("No Preview Link but heres the album link: " + data.tracks.items[0].external_urls.spotify)
            }
            else 
            {
                console.log("Preview link: " + data.tracks.items[0].preview_url)
            }
            console.log("Name of album: " + data.tracks.items[0].album.name);
        })
    })
}