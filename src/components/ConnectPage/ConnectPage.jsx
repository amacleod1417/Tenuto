import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import styles from '../../../styles';

const ConnectPage = () => {
  return (
    <View style={styles.page}>
      <Text style={styles.header}>let's get connected</Text>
      <TouchableOpacity style={styles.button} onPress={() => Alert.alert('spotify pressed')}>
        <Text style={styles.buttonText}>spotify</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => Alert.alert('fitbit pressed')}>
        <Text style={styles.buttonText}>fibit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConnectPage;
