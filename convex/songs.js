const { query, mutation } = require("./_generated/server");
import { v } from "convex/values";

// Insert a song into the "songsTable"
// const insertSong = mutation(async ({ db }, songData) => {
//   // Validate incoming song data
//   if (!songData.name || !songData.artists) {
//     throw new Error("Song data is missing essential fields.");
//   }

//   // Insert the song data into the 'songsTable'
//   await db.insert('songsTable', songData);

//   // Optionally return success message or inserted data
//   return { status: "success", songId: songData.id };
// });

// // Export the mutation so it can be used elsewhere
// module.exports = {
//   insertSong
// };

// export const findArtist = query({
//   args: {
//     title: "string",
//   },
//   handler: async (ctx) => {
//     const artist = await ctx.db.query("songs").order("desc").take(100);
//     // Reverse the list so that it's in a chronological order.
//     return messages.reverse();
//   },
// });

export const getArtist = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const song = await ctx.db
      .query("songs")
      .filter((q) => q.eq(q.field("name"), args.name))
      .unique();
    return song.artists;
  },
});



// export const list = query({
//   args: {},
//   handler: async (ctx) => {
//     // Grab the most recent messages.
//     const messages = await ctx.db.query("messages").order("desc").take(100);
//     // Reverse the list so that it's in a chronological order.
//     return messages.reverse();
//   },
// });
