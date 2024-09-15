import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../../styles';
import { Audio } from 'expo-av';

const SongsPage = () => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

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
      <Text style={styles.header}>Songs Page</Text>
      <TouchableOpacity style={styles.button} onPress={playPauseSound}>
        <Text style={styles.audioControl}>{isPlaying ? '⏸' : '▶️'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SongsPage;
