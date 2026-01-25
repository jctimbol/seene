let currentSongIndex = 0;
let shuffledSongs = [];

const urlParams = new URLSearchParams(window.location.search);
const region = urlParams.get('region');

let titleText = document.getElementById("title");
let newText = document.createElement('regionText');
if(!window.location.pathname.endsWith("leaderboard.html")) {
titleText.prepend(newText, `${region}`);
}

const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('rating-value');
let currentRating = 0;

if(region) {
    loadSongsByRegion(region);
}