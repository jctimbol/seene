async function loadLeaderboard() {
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
}

document.addEventListener("DOMContentLoaded", loadLeaderboard);
