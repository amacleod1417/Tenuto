import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../../styles';
// import images from '../../assets/images';

const WelcomePage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.page}>
      {/* <Image source={images.logo} style={styles.logo} /> */}
      {/* <Image source={require('./logo.png')} style={styles.logo} /> */}
      <Text style={styles.logo}>tenuto</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Connect')}>
        <Text style={styles.buttonText}>welcome</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomePage;
