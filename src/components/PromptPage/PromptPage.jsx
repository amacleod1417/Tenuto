import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../../styles';
import Footer from '../Footer/Footer';
import { AppContext } from '../../AppContext';

const PromptPage = () => {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState('');
  const { sharedData, setSharedData } = useContext(AppContext);

  const handleSubmit = async () => {
    setSharedData(inputText);
    try {
      console.log('Submitting inputText:', inputText);
  
      const response = await fetch('http://10.36.224.117:5001/process_input', {  // Use your Flask server IP
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });
  
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
  
      const responseText = await response.text();
      console.log('Response text:', responseText);
  
      // Try to parse the responseText
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        Alert.alert('Error', 'Failed to parse server response.');
        return;
      }
  
      if (response.ok) {
        // Navigate to the Song screen or handle the received data as needed
        console.log('Received data:', data);
          // Pass data to the Song screen if needed
      } else {
        Alert.alert('Error', data.error || 'Failed to process input.');
      }
    } catch (error) {
      console.error('Error submitting input:', error);
      Alert.alert('Error', 'Failed to communicate with the server.');
    }
    navigation.navigate('Song');
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Text style={styles.header}>what's on your mind?</Text>
          <TextInput
            style={styles.input}
            placeholder="how are you, really?"
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={10}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>submit</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      <Footer />
    </KeyboardAvoidingView >
  );
};

export default PromptPage;
