function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
