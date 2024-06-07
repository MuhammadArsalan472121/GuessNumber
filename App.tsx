import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, TextInput, Animated } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';


const GuessNumberGame = () => {
  const [guess, setGuess] = useState('');
  const [randomNumber, setRandomNumber] = useState(0); // Initial state set to 0
  const [imageUrl, setImageUrl] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [hint, setHint] = useState('');

  const generateRandomNumber = () => {
    const randomNum = Math.floor(Math.random() * 10) + 1;
    setHint(randomNum);
    return randomNum;
  };

  useEffect(() => {
    setRandomNumber(generateRandomNumber()); // Call generateRandomNumber here
  }, []);

  useEffect(() => {
    fetchImage();
  }, [randomNumber]);

  const fetchImage = async () => {
    try {
      const response = await fetch('https://source.unsplash.com/random');
      setImageUrl(response.url);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const handleGuess = () => {
    if (parseInt(guess) === randomNumber) {
      setShowImage(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      setGuess('');
      resetGame();
      alert('Incorrect guess. Try again!');
    }
  };

  const handleDownload = async () => {
    try {
      const dirs = RNFetchBlob.fs.dirs;
      const path = dirs.DownloadDir + '/image.jpg'; // Path to save the downloaded image
      const response = await RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: path,
        },
      }).fetch('GET', imageUrl);
      if (response.respInfo.status === 200) {
        alert('Image downloaded successfully!');
      } else {
        alert('Image downloaded successfully!');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image!');
    }
  };

  const resetGame = () => {
    setGuess('');
    setRandomNumber(generateRandomNumber());
    setShowImage(false);
    animation.setValue(0);
  };

  const renderOptions = () => {
    if (showImage) {
      return (
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={resetGame} style={styles.option}>
            <Image source={require('./assets/reload.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDownload} style={styles.option}>
            <Image source={require('./assets/download.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={resetGame} style={styles.option}>
            <Image source={require('./assets/close.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={handleGuess}>
            <Text style={styles.optionb} >Guess</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const interpolatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guess the Number Game</Text>
      <Text style={styles.subtitle}>Guess a number between 1 and 10:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={text => setGuess(text)}
          value={guess}
          keyboardType="numeric"
        />
      </View>
      {renderOptions()}
      <Animated.View style={[styles.imageContainer, { opacity: interpolatedOpacity }]}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          defaultSource={require('./assets/heart.png')} // Use heart image as default
        />
      </Animated.View>
      <Text>You have {hint} tries</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    marginBottom: 20,
  },
  input: {
    fontSize: 18,
    paddingHorizontal: 10,
    borderWidth:1,
    borderRadius:30,
    borderColor:'black',
    textAlign:'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  optionb:{
    borderWidth: 2, 
    borderRadius: 20, 
    borderColor: 'blue',
    backgroundColor:'blue', 
    textAlign:'center',
    color: 'white', 
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
  },
  icon: {
    width: 30,
    height: 30
  },
});

export default GuessNumberGame;
