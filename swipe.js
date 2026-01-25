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
