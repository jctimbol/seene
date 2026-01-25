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

async function loadSongsByRegion(region) {
    const { data: bands, error: bandError } = await client
        .from('bandss')
        .select('id, name')
        .ilike('region', region);
    
    if(bandError) {
        console.error('error: ', bandError);
        return;
    }

    const bandIds = bands.map(b => b.id);

    if (bandIds.length === 0) {
        document.getElementById('songCardContainer').innerHTML = `<p>No bands found for ${region}.</p>`;
        return;
    }

    const { data : songs, error: songError } = await client
        .from('songs')
        .select('*, bandss(name)')
        .in('band_id', bandIds);

    
    if(songError) {
        console.error('error: ', songError);
        return;
    }

    shuffledSongs = shuffle(songs);
    renderCurrentSong();

}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

 function renderCurrentSong() {
    
    if(!window.location.pathname.endsWith("leaderboard.html")) updateStars();
     const container = document.getElementById('songCardContainer');
  const song = shuffledSongs[currentSongIndex];

  if (!song) {
    if(window.location.pathname.endsWith("leaderboard.html")) {
        document.getElementById("nextSong").innerHTML = `you reached the end of the leaderboard!`;
        return;
    }
    document.getElementById("star-rating").innerHTML = '';
    document.getElementById("nextSong").innerHTML = '';
    container.innerHTML = ` 
    <div class="song-card">
        <div class="column">
        <p>no more songs for this region in our database.<br>wanna put people on?</p> 
    <form id="songForm">
    band name:    <input name="bandName" required><br>
    song title:   <input name="title" required><br>
    bandcamp url: <input name="audioUrl" required><br>
    region:       <select> <option>    </option>
                    <option> north bay </option>
                    <option> east bay </option>
                    <option> south bay </option>
                    <option> peninsula (+ sf) </option>
                </select> <br>
    city:            <input name="city"><br>
      <button type="submit">submit</button>
    </form>
        </div>
    </div>
    
    <style>
        body {
        color: beige;
    }
         .song-card {
            background-color:rgb(215, 207, 185);
            background-image: url("/textures/cardbg.jpg"), linear-gradient(#faf9f6, #faf9f6);
            background-blend-mode: soft-light;
            background-size: cover;
            color:rgb(45, 32, 3);
            filter: drop-shadow(0px 0px 15px rgb(0, 0, 0));
            margin: auto;
            display: flex;
            gap: 25px;
            padding: 50px;
            width: 750px;
            height: 400px;
            align: center;
            //border: 1px solid blue;
            margin-top: 150px;
            border: 10px solid transparent;
            border-image-source: url('/textures/frame.jpg'); 
            border-image-slice: 30;
            
        }
        .column { 
            flex: 1;
            margin: 70px;
            padding: 5px;
        }
        .btn {
            color: beige;
            padding: 10px;
            text-align: center;
        } 
        form {
            line-height:125%;
        }
    </style>`;
    /*
    container.innerHTML = `<p>no more songs.</p> 
    <a href="/index.html" id="back" class="btn">back to region select</a>`;*/
    return;
  }
  if(window.location.pathname.endsWith("leaderboard.html")) {
    var image = song.songs.cover_img;
    var bandName = song.songs.bandss.name;
    var title = song.songs.title;
    var url = song.songs.audio_url;
    var genres = song.songs.genre_tags?.join(', ') || 'N/A';
    var songRating = song.rating;
    var songVotes = song.votes;
    var place = "#" + (currentSongIndex + 1);
    document.getElementById("songPlace").textContent = place;
    document.getElementById("ratingText").innerHTML = `average rating: ${songRating.toFixed(2)} stars <br>votes: ${songVotes}`;
  }
  else {
     image = song.cover_img;
     bandName = song.bandss.name;
     title = song.title;
     url = song.audio_url;
     genres = song.genre_tags?.join(', ') || 'N/A';
  }

  container.innerHTML = `
    <div class="song-card">
        <div class="column">
         <img src="${image}" class ="albumCover" alt="cover" style="width: 350px; height: 350px; object-fit: cover;" />
        </div>
        <div class="column">
         <h1>${bandName} – ${title}</h1>
         <h3> <a href="${url}" target="_blank" id="listenLink">listen</a> </h3>
         <p>genres: ${genres}</p>
         </div>
    </div> <br>

    <style> 
        #listenLink {
            color: rgb(82, 3, 3);
        }
        .albumCover {   
            image-rendering: pixelated;
            image-rendering: crisp-edges;
            filter: contrast(1.25) brightness(0.95) saturate(1.25) sepia(0.2); 
            filter: drop-shadow(0px 0px 10px rgb(46, 50, 44));
        }
        button {margin: 10px;} 
        .song-card {
            background-color:rgb(215, 207, 185);
            background-image: url("/textures/cardbg.jpg"), linear-gradient(#faf9f6, #faf9f6);
            background-blend-mode: soft-light;
            background-size: cover;
            color:rgb(45, 32, 3);
            filter: drop-shadow(0px 0px 15px rgb(0, 0, 0));
            margin: auto;
            display: flex;
            gap: 25px;
            padding: 50px;
            width: 750px;
            height: 400px;
            align: center;
            //border: 1px solid blue;
            margin-top: 150px;
            border: 10px solid transparent;
            border-image-source: url('/textures/frame.jpg'); 
            border-image-slice: 30;
            
        }
        .column { 
            flex: 1;
            margin: auto;
            padding: 10px;
        }
        .btn {
            color: beige;
            padding: 10px;
            text-align: center;
        } 
    </style> 
  `;

  // Attach click listener after DOM updates
    document.getElementById("nextSong").onclick = async (event) => {
        if(window.location.pathname.endsWith("leaderboard.html")) {
            currentSongIndex++;
        }
        else {
            event.preventDefault();
             await submitRating();
            updateStars();
            document.getElementById("ratingCaption").textContent = "rate the song!";
            currentSongIndex++;
            currentRating = 0;
        }
        renderCurrentSong();
     };

      document.getElementById("back").onclick = () => {
            window.location.href = `index.html`;
        };

stars.forEach(star => {
  star.addEventListener('click', () => {
    currentRating = parseInt(star.getAttribute('data-value'));
    updateStars();
  });

  star.addEventListener('onclick', () => {
    highlightStars(parseInt(star.getAttribute('data-value')));
  });

  
});

function updateStars() {
  stars.forEach(star => {
    star.classList.toggle('active', parseInt(star.getAttribute('data-value')) <= currentRating);
  });
  if(currentRating == 1) {document.getElementById("ratingCaption").textContent="ts buns";}
  else if(currentRating == 2) {document.getElementById("ratingCaption").textContent="not my cup of tea";}
  else if(currentRating == 3) {document.getElementById("ratingCaption").textContent="it's okay";}
  else if(currentRating == 4) {document.getElementById("ratingCaption").textContent="pretty good!";}
  else if(currentRating == 5) {document.getElementById("ratingCaption").textContent="awesomesauce...";}
}

function highlightStars(rating) {
  stars.forEach(star => {
    star.classList.toggle('active', parseInt(star.getAttribute('data-value')) <= rating);
  });
}
}

async function getSongRating(songId) {
    const {data, error} = await client
        .from('ratings')
        .select('rating, votes')
        .eq('song_id', songId)
        .single();
    if(error) console.error(error);
    return data;
}

async function submitRating() {
    
    const { data: bands, error: bandError } = await client
        .from('bandss')
        .select('id, name')
        .ilike('region', region);
    
    if(bandError) {
        console.error('error: ', bandError);
        return;
    }

    const bandIds = bands.map(b => b.id);

    const { data : songs, error: songError } = await client
        .from('songs')
        .select('*, bandss(name)')
        .in('band_id', bandIds);

    const songId = shuffledSongs[currentSongIndex].id;

    const {data: songRating, error} = await client
        .from('ratings')
        .select('rating, votes')
        .eq('song_id', songId)
        .single();

    if(error) console.error(error);

    let avgRating = songRating.rating;
    let newVotes = songRating.votes + 1;
    let newAvg = ((songRating.rating * songRating.votes ) + currentRating) / newVotes;

    const { data, error: updateError } = await client
        .from("ratings")
        .update({rating : newAvg, votes: newVotes})
        .eq("song_id", songId)
        .select();
    
    if(updateError) console.error(updateError); 

}

if(window.location.pathname.endsWith("leaderboard.html")) {
    document.addEventListener("DOMContentLoaded", () => { 
    (async () => { 
        const { data: songs, error } = await client
    .from('ratings')
    .select(`
     *,
    songs (
      *,
      bandss (
        name
      )
    )
  `)
    .order('rating', { ascending: false })
    .order('votes', {ascending: false }); // highest rating first

    if (error) {
        console.error(error);
    } 
    shuffledSongs = songs;
    currentSongIndex = 0;

        renderCurrentSong();
    })();
    
});

   
}