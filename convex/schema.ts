
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    songs: defineTable(
      {
        artists: v.string(),
        danceability: v.float64(),
        emotions: v.array(
          v.string()),
        energy: v.float64(),
        genres: v.array(v.string()),
        id: v.string(),
        meaning: v.string(),
        name: v.string(),
        tempo: v.float64(),
        valence: v.float64(),
      }),
  });
