import { ConvexProvider, ConvexReactClient } from "convex/react";
import { EXPO_PUBLIC_CONVEX_URL } from "@env";

import React, { StrictMode, useState, useEffect } from "react";
import { FlatList, SafeAreaView, Text, TextInput, View, Button } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "./convex/_generated/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpotifyAuthScreen from './src/components/SpotifyAuthScreen';
import SpotifyLikedSongs from './src/screens/SpotifyLikedSongs';
import styles from "./styles";

// Chat functionality
function InnerApp() {

  const messages = useQuery(api.messages.list) || [];
  const [newMessageText, setNewMessageText] = useState("");
  const sendMessage = useMutation(api.messages.send);
  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));

  async function handleSendMessage(event) {
    event.preventDefault();
    setNewMessageText("");
    await sendMessage({ body: newMessageText, author: name });
  }

  return (
    <SafeAreaView style={styles.body}>
      <Text style={styles.title}>Convex Chat</Text>
      <View style={styles.name}>
        <Text style={styles.nameText} testID="NameField">
          {name}
        </Text>
      </View>
      <FlatList
        data={messages.slice(-10)}
        testID="MessagesList"
        renderItem={(x) => {
          const message = x.item;
          return (
            <View style={styles.messageContainer}>
              <Text>
                <Text style={styles.messageAuthor}>{message.author}:</Text>{" "}
                {message.body}
              </Text>
              <Text style={styles.timestamp}>
                {new Date(message._creationTime).toLocaleTimeString()}
              </Text>
            </View>
          );
        }}
      />
      <TextInput
        placeholder="Write a message…"
        style={styles.input}
        onSubmitEditing={handleSendMessage}
        onChangeText={(newText) => setNewMessageText(newText)}
        defaultValue={newMessageText}
        testID="MessageInput"
      />
    </SafeAreaView>
  );
}

const App = () => {

  const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL, {

    unsavedChangesWarning: false, // Disable for React Native compatibility
  });

  const [accessToken, setAccessToken] = useState(null);
  const [showChatApp, setShowChatApp] = useState(true);  // Manage chat and Spotify views

  // Check for access token from storage or other sources
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('accessToken');
      if (storedToken) {
        setAccessToken(storedToken);
      }
    };
    loadToken();
  }, []);

  const handleToken = async (token) => {
    setAccessToken(token);
    await AsyncStorage.setItem('accessToken', token); // Store the token
  };

  return (
    <StrictMode>
      <ConvexProvider client={convex}>
        {!accessToken ? (
          // If no access token, show the Spotify authentication screen
          <SpotifyAuthScreen onAuthenticated={handleToken} />
        ) : (
          // If authenticated, show Spotify functionality or the chat app based on state
          showChatApp ? (
            <>
              <InnerApp />  {/* Chat functionality */}
              <Button title="Switch to Spotify" onPress={() => setShowChatApp(false)} />
            </>
          ) : (
            <>
              <SpotifyLikedSongs accessToken={accessToken} />
              <Button title="Switch to Chat" onPress={() => setShowChatApp(true)} />
            </>
          )
        )}
      </ConvexProvider>
    </StrictMode>
  );
};

export default App;
