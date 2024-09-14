import { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { useMutation } from 'convex/react';

const SpotifyLikedSongs = ({ accessToken }) => {
  const [likedSongs, setLikedSongs] = useState(null);
  const getUserLikedSongs = useMutation('spotify:getUserLikedSongs');

  const fetchLikedSongs = async () => {
    try {
      const songs = await getUserLikedSongs({ accessToken });
      setLikedSongs(songs);
    } catch (error) {
      console.error('Error fetching liked songs:', error);
    }
  };

  return (
    <View>
      <Button title="Fetch Liked Songs" onPress={fetchLikedSongs} />
      {likedSongs && likedSongs.map((song, index) => (
        <Text key={index}>{song.track.name}</Text>
      ))}
    </View>
  );
};

export default SpotifyLikedSongs;
