import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../../styles';
import Footer from '../Footer/Footer';

const ConnectPage = () => {
  const [spotifyPressed, setSpotifyPressed] = useState(false);
  const [fitbitPressed, setFitbitPressed] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (spotifyPressed && fitbitPressed) {
      navigation.navigate('Prompt');
    }
  }, [spotifyPressed, fitbitPressed, navigation]);

  return (
    <View style={styles.page}>
      <Text style={styles.header}>let's get connected</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          Alert.alert('spotify pressed');
          setSpotifyPressed(true);
        }}
      >
        <Text style={styles.buttonText}>spotify</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          Alert.alert('fitbit pressed');
          setFitbitPressed(true);
        }}
      >
        <Text style={styles.buttonText}>fitbit</Text>
      </TouchableOpacity>
      <Footer />
    </View>
  );
};

export default ConnectPage;
