const { query, mutation } = require("./_generated/server");

// Insert a song into the "songsTable"
const insertSong = mutation(async ({ db }, songData) => {
  // Validate incoming song data
  if (!songData.name || !songData.artists) {
    throw new Error("Song data is missing essential fields.");
  }

  // Insert the song data into the 'songsTable'
  await db.insert('songsTable', songData);

  // Optionally return success message or inserted data
  return { status: "success", songId: songData.id };
});

// Export the mutation so it can be used elsewhere
module.exports = {
  insertSong
};