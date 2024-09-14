import { mutation } from "./_generated/server";
import axios from "axios";

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
    return response.data.items;
  });