import { mutation } from "./_generated/server";
import axios from "axios";
import Sentiment from "sentiment";

const SPOTIFY_CLIENT_ID = 'c23f40c6d01e4b03855a68d27434e14b';
const SPOTIFY_CLIENT_SECRET = '38234dc4660c445e9f3ed8f0637460d2';

export const getSpotifyAccessToken = mutation(async () => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: SPOTIFY_CLIENT_ID,
      client_secret: SPOTIFY_CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const { access_token } = response.data;
  return { accessToken: access_token };
});

export const getUserLikedSongs = mutation(async ({ accessToken }) => {
  const response = await axios.get(
    'https://api.spotify.com/v1/me/tracks',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 50, // Max 50 tracks per request
      },
    }
  );
  return response.data.items.reduce((acc, item) => {
    acc[item.track.id] = {
      name: item.track.name,
      artists: item.track.artists.map((artist) => artist.name).join(', '),
    };
    return acc;
  }, {}); //use reduce to create a json object with song IDs as keys
});

//fetch attributes
export const getSongAttributes = mutation(async ({ accessToken, trackIds }) => {
  const response = await axios.get(
    'https://api.spotify.com/v1/audio-features',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        ids: trackIds.join(','),
      },
    }
  );

  return response.data.audio_features.reduce((acc, track) => {
    acc[track.id] = {
      danceability: track.danceability,
      energy: track.energy,
      tempo: track.tempo,
      valence: track.valence,
    };
    return acc;
  }, {}); // Store audio features as json object using song IDs as keys
});


const analyzeSentimentForSongs = (songs) => {
  const sentiment = new Sentiment();
  const songIds = Object.keys(songs);

  return songIds.reduce((acc, id) => {
    const sentimentResult = sentiment.analyze(songs[id].name);
    acc[id] = {
      ...songs[id],
      sentimentScore: sentimentResult.score,
    };
    return acc;
  }, {});
};

//combine sentiment analysis and song attributes
export const getSongsWithSentimentAndAttributes = mutation(async ({ accessToken }) => {

  const likedSongs = await getUserLikedSongs({ accessToken });
  const trackIds = Object.keys(likedSongs); // Get an array of song IDs
  const songAttributes = await getSongAttributes({ accessToken, trackIds });
  const songsWithSentiment = analyzeSentimentForSongs(likedSongs);

  //combine sentiment analysis and song attributes
  return trackIds.reduce((acc, id) => {
    acc[id] = {
      ...songsWithSentiment[id],
      ...songAttributes[id],
    };
    return acc;
  }, {}); //final object with song IDs as keys
});
