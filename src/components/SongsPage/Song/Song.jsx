import React from 'react';
import { View, Text } from 'react-native';

const Song = ({ title, artist }) => {
  return (
    <View style={styles.song}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.artist}>{artist}</Text>
    </View>
  );
};

export default Song;
