import SpotifyLocally from "spotify-locally";

let spotify = new SpotifyLocally();

spotify.getStatus().then((status)=>{
    console.log(status);
}).catch((err)=>{
    console.log(err);
});