import React, { useEffect } from 'react';
import { Button, Linking, Alert } from 'react-native';
import { useMutation } from 'convex/react';

const spotifyAuthorizeUrl = `https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI&scope=user-library-read`;

const SpotifyAuthScreen = ({ onAuthenticated }) => {
  const exchangeSpotifyCode = useMutation('spotify:exchangeSpotifyCode');

  const handleSpotifyRedirect = (event) => {
    const url = event.url;
    const authorizationCode = new URL(url).searchParams.get('code');
    if (authorizationCode) {
      // Exchange code for token using Convex backend
      exchangeSpotifyCode({ code: authorizationCode })
        .then((response) => {
          const { accessToken } = response;
          onAuthenticated(accessToken); // Pass token to App component
        })
        .catch((error) => {
          console.error('Error exchanging code:', error);
          Alert.alert('Error', 'Failed to authenticate with Spotify.');
        });
    }
  };

  useEffect(() => {
    // Listen for Spotify redirect
    const subscription = Linking.addEventListener('url', handleSpotifyRedirect);
    return () => {
      subscription.remove();
    };
  }, []);

  const openSpotifyAuth = () => {
    Linking.openURL(spotifyAuthorizeUrl);
  };

  return <Button title="Login to Spotify" onPress={openSpotifyAuth} />;
};

export default SpotifyAuthScreen;
