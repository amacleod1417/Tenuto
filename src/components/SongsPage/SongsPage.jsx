import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import styles from '../../../styles';

const SongsPage = () => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({ title: 'Song 1', artist: 'Artist 1' });

  async function playPauseSound() {
    if (sound) {
      if (isPlaying) {
        console.log('Pausing Sound');
        await sound.pauseAsync();
      } else {
        console.log('Playing Sound');
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(require('./party.mp3'));
      setSound(sound);
      console.log('Playing Sound');
      await sound.playAsync();
      setIsPlaying(true);

      // Set the playback status update callback
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          console.log('Song has finished playing');
          setIsPlaying(false);
        }
      });
    }
  }

  useEffect(() => {
    return sound
      ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.page}>
      <Text style={styles.header}>here are some songs for you</Text>
      <Text style={styles.subheader}>we hope you love them</Text>
      <View style={styles.song}>
        <TouchableOpacity style={styles.button} onPress={playPauseSound}>
          <Text style={styles.audioControl}>{isPlaying ? '⏸' : '▶️'}</Text>
        </TouchableOpacity>
        <View style={styles.songDetails}>
          <Text style={styles.title}>{currentSong.title}</Text>
          <Text style={styles.artist}>{currentSong.artist}</Text>
        </View>
      </View>
    </View>
  );
};

export default SongsPage;
