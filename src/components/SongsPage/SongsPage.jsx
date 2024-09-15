import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import styles from '../../../styles';
import Footer from '../Footer/Footer';

const SongsPage = () => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({ title: 'WHY?', artist: 'Taylor Swift' });

  // const songFilePath = (song) => {
  //   return await Audio.Sound.createAsync(require('./songs' + song.replace(/[^a-zA-Z]/g, '').toUpperCase() + '.mp3'));
  // }


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
      const { sound } = await getSound(currentSong.title);
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
      <TouchableOpacity style={styles.button} onPress={() => { }}>
        <Text style={styles.buttonText}>next song</Text>
      </TouchableOpacity>
      <Footer />
    </View>
  );
};


const getSound = async (songName) => {
  switch (songName) {
    case "Dancing In the Dark":
      return await Audio.Sound.createAsync(require('./DANCINGINTHEDARK.mp3'));
    case "Heaven Knows I'm Miserable Now - 2011 Remaster":
      return await Audio.Sound.createAsync(require('./HEAVENKNOWSIMMISERABLENOW2011REMASTER.mp3'));
    case "Matilda":
      return await Audio.Sound.createAsync(require('./MATILDA.mp3'));
    case "Monks":
      return await Audio.Sound.createAsync(require('./MONKS.mp3'));
    case "Sweet Disposition":
      return await Audio.Sound.createAsync(require('./SWEETDISPOSITION.mp3'));
    case "needy":
      return await Audio.Sound.createAsync(require('./NEEDY.mp3'));
    case "Don't Change":
      return await Audio.Sound.createAsync(require('./DONTCHANGE.mp3'));
    case "Talk talk":
      return await Audio.Sound.createAsync(require('./TALKTALK.mp3'));
    case "Alesis":
      return await Audio.Sound.createAsync(require('./ALESIS.mp3'));
    case "Check It Out":
      return await Audio.Sound.createAsync(require('./CHECKITOUT.mp3'));
    case "My Name on a T-Shirt":
      return await Audio.Sound.createAsync(require('./MYNAMEONATSHIRT.mp3'));
    case "West Savannah (feat. SZA)":
      return await Audio.Sound.createAsync(require('./WESTSAVANNAHFEATSZA.mp3'));
    case "evermore (feat. Bon Iver)":
      return await Audio.Sound.createAsync(require('./EVERMOREFEATBONIVER.mp3'));
    case "The Smallest Man Who Ever Lived":
      return await Audio.Sound.createAsync(require('./THESMALLESTMANWHOEVERLIVED.mp3'));
    case "Anyway":
      return await Audio.Sound.createAsync(require('./ANYWAY.mp3'));
    case "Frisky":
      return await Audio.Sound.createAsync(require('./FRISKY.mp3'));
    case "Please End Me":
      return await Audio.Sound.createAsync(require('./PLEASEENDME.mp3'));
    case "Sorry":
      return await Audio.Sound.createAsync(require('./SORRY.mp3'));
    case "Style (Taylor's Version)":
      return await Audio.Sound.createAsync(require('./STYLETAYLORSVERSION.mp3'));
    case "Super Shy":
      return await Audio.Sound.createAsync(require('./SUPERSHY.mp3'));
    case "Melting":
      return await Audio.Sound.createAsync(require('./MELTING.mp3'));
    case "Love Affair":
      return await Audio.Sound.createAsync(require('./LOVEAFFAIR.mp3'));
    case "Some":
      return await Audio.Sound.createAsync(require('./SOME.mp3'));
    case "threethou - latenight":
      return await Audio.Sound.createAsync(require('./THREETHOULATENIGHT.mp3'));
    case "True Blue":
      return await Audio.Sound.createAsync(require('./TRUEBLUE.mp3'));
    case "Is It Over Now? (Taylor's Version) (From The Vault)":
      return await Audio.Sound.createAsync(require('./ISITOVERNOWTAYLORSVERSIONFROMTHEVAULT.mp3'));
    case "Break from Toronto":
      return await Audio.Sound.createAsync(require('./BREAKFROMTORONTO.mp3'));
    case "LIMB":
      return await Audio.Sound.createAsync(require('./LIMB.mp3'));
    case "terms (feat. Dominic Fike & Denzel Curry)":
      return await Audio.Sound.createAsync(require('./TERMSFEATDOMINICFIKEDENZELCURRY.mp3'));
    case "Black Hole":
      return await Audio.Sound.createAsync(require('./BLACKHOLE.mp3'));
    case "Think Fast (feat. Weezer)":
      return await Audio.Sound.createAsync(require('./THINKFASTFEATWEEZER.mp3'));
    case "Stockholm Syndrome":
      return await Audio.Sound.createAsync(require('./STOCKHOLMSYNDROME.mp3'));
    case "Chasing Pavements":
      return await Audio.Sound.createAsync(require('./CHASINGPAVEMENTS.mp3'));
    case "Feeling Whitney":
      return await Audio.Sound.createAsync(require('./FEELINGWHITNEY.mp3'));
    case "Stay":
      return await Audio.Sound.createAsync(require('./STAY.mp3'));
    case "Rose Blood":
      return await Audio.Sound.createAsync(require('./ROSEBLOOD.mp3'));
    case "SUPERPOSITION":
      return await Audio.Sound.createAsync(require('./SUPERPOSITION.mp3'));
    case "WHY?":
      return await Audio.Sound.createAsync(require('./WHY.mp3'));
    case "BEEN HERE BEFORE":
      return await Audio.Sound.createAsync(require('./BEENHEREBEFORE.mp3'));
    case "An Old Farmer's Smile":
      return await Audio.Sound.createAsync(require('./ANOLDFARMERSSMILE.mp3'));
    case "A Month Or Two":
      return await Audio.Sound.createAsync(require('./AMONTHORTWO.mp3'));
    case "Crop Circles":
      return await Audio.Sound.createAsync(require('./CROPCIRCLES.mp3'));
    case "MELTDOWN (feat. Drake)":
      return await Audio.Sound.createAsync(require('./MELTDOWNFEATDRAKE.mp3'));
    case "What Kind of Love":
      return await Audio.Sound.createAsync(require('./WHATKINDOFLOVE.mp3'));
    case "Tomioka":
      return await Audio.Sound.createAsync(require('./TOMIOKA.mp3'));
    case "Babylon (feat. Kendrick Lamar)":
      return await Audio.Sound.createAsync(require('./BABYLONFEATKENDRICKLAMAR.mp3'));
    case "Fall in Love with You.":
      return await Audio.Sound.createAsync(require('./FALLINLOVEWITHYOU.mp3'));
    case "Hell N Back":
      return await Audio.Sound.createAsync(require('./HELLNBACK.mp3'));
    case "Moment Of Your Life":
      return await Audio.Sound.createAsync(require('./MOMENTOFYOURLIFE.mp3'));
    case "Jimmy Cooks (feat. 21 Savage)":
      return await Audio.Sound.createAsync(require('./JIMMYCOOKSFEAT21SAVAGE.mp3'));
    default:
      return await Audio.Sound.createAsync(require('./TALKTALK.mp3'));
  }
}

export default SongsPage;
