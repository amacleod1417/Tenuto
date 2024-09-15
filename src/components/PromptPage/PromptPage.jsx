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

  const handleSubmit = () => {
    navigation.navigate('Song');
    setSharedData(inputText);
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
