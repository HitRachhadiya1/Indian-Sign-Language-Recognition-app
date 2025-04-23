import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WordToSignScreen = ({navigation}) => {
  const [inputText, setInputText] = useState('');
  const [signImages, setSignImages] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);

  // This function will convert input word to an array of characters and assign images
  const translateWord = () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);

    // Convert the input text to uppercase for consistency
    const word = inputText.toUpperCase();

    // Create an array of characters with their corresponding images
    const characterArray = word.split('').map(char => {
      if (char === ' ') {
        return {
          char: 'space',
          imageSource: null, // Space has no image
        };
      }

      // Load images for each character
      let imageSource;
      try {
        // Handle each letter dynamically
        switch (char) {
          case 'A':
            imageSource = require('../assets/sample/A.jpg');
            break;
          case 'B':
            imageSource = require('../assets/sample/B.jpg');
            break;
          case 'C':
            imageSource = require('../assets/sample/C.jpg');
            break;
          case 'D':
            imageSource = require('../assets/sample/D.jpg');
            break;
          case 'E':
            imageSource = require('../assets/sample/E.jpg');
            break;
          case 'F':
            imageSource = require('../assets/sample/F.jpg');
            break;
          case 'G':
            imageSource = require('../assets/sample/G.jpg');
            break;
          case 'H':
            imageSource = require('../assets/sample/H.jpg');
            break;
          case 'I':
            imageSource = require('../assets/sample/I.jpg');
            break;
          case 'J':
            imageSource = require('../assets/sample/J.jpg');
            break;
          case 'K':
            imageSource = require('../assets/sample/K.jpg');
            break;
          case 'L':
            imageSource = require('../assets/sample/L.jpg');
            break;
          case 'M':
            imageSource = require('../assets/sample/M.jpg');
            break;
          case 'N':
            imageSource = require('../assets/sample/N.jpg');
            break;
          case 'O':
            imageSource = require('../assets/sample/O.jpg');
            break;
          case 'P':
            imageSource = require('../assets/sample/P.jpg');
            break;
          case 'Q':
            imageSource = require('../assets/sample/Q.jpg');
            break;
          case 'R':
            imageSource = require('../assets/sample/R.jpg');
            break;
          case 'S':
            imageSource = require('../assets/sample/S.jpg');
            break;
          case 'T':
            imageSource = require('../assets/sample/T.jpg');
            break;
          case 'U':
            imageSource = require('../assets/sample/U.jpg');
            break;
          case 'V':
            imageSource = require('../assets/sample/V.jpg');
            break;
          case 'W':
            imageSource = require('../assets/sample/W.jpg');
            break;
          case 'X':
            imageSource = require('../assets/sample/X.jpg');
            break;
          case 'Y':
            imageSource = require('../assets/sample/Y.jpg');
            break;
          case 'Z':
            imageSource = require('../assets/sample/Z.jpg');
            break;
          default:
            imageSource = null;
        }
      } catch (error) {
        console.warn(`Could not load image for character: ${char}`);
        imageSource = null;
      }

      return {
        char,
        imageSource,
      };
    });

    setSignImages(characterArray);
    setIsTranslating(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Word to Sign</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.instructionCard}>
          <Icon name="lightbulb-outline" size={24} color="#6C63FF" />
          <Text style={styles.instructionText}>
            Type a word and see its representation in sign language
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter a word (e.g., HELLO)"
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            autoCapitalize="characters"
            maxLength={15}
          />
          <TouchableOpacity
            style={[
              styles.translateButton,
              !inputText.trim() && styles.disabledButton,
            ]}
            onPress={translateWord}
            disabled={!inputText.trim()}>
            <Text style={styles.translateButtonText}>Translate</Text>
          </TouchableOpacity>
        </View>

        {signImages.length > 0 && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Sign Language Translation</Text>

            <FlatList
              data={signImages}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `sign-${index}`}
              contentContainerStyle={styles.signImagesContainer}
              renderItem={({item}) => {
                if (item.char === 'space') {
                  return <View style={styles.spaceContainer} />;
                }

                return (
                  <View style={styles.signImageWrapper}>
                    {item.imageSource ? (
                      <Image
                        source={item.imageSource}
                        style={styles.signImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.missingImageContainer}>
                        <Icon name="image-off" size={30} color="#999" />
                      </View>
                    )}
                    <Text style={styles.characterLabel}>{item.char}</Text>
                  </View>
                );
              }}
            />

            <Text style={styles.pronunciationTitle}>How to sign:</Text>
            <Text style={styles.pronunciationText}>
              Follow the signs from left to right. Make each sign clearly before
              moving to the next.
            </Text>
          </View>
        )}

        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Common Examples</Text>

          <TouchableOpacity
            style={styles.exampleCard}
            onPress={() => {
              setInputText('HELLO');
              setTimeout(() => translateWord(), 100);
            }}>
            <Text style={styles.exampleWord}>HELLO</Text>
            <Icon name="gesture-tap" size={20} color="#6C63FF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exampleCard}
            onPress={() => {
              setInputText('THANK YOU');
              setTimeout(() => translateWord(), 100);
            }}>
            <Text style={styles.exampleWord}>THANK YOU</Text>
            <Icon name="gesture-tap" size={20} color="#6C63FF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exampleCard}
            onPress={() => {
              setInputText('PLEASE');
              setTimeout(() => translateWord(), 100);
            }}>
            <Text style={styles.exampleWord}>PLEASE</Text>
            <Icon name="gesture-tap" size={20} color="#6C63FF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    elevation: 2,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E6FF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  instructionText: {
    flex: 1,
    color: '#444',
    marginLeft: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  translateButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#C5C5C5',
  },
  translateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  signImagesContainer: {
    paddingVertical: 10,
  },
  signImageWrapper: {
    marginRight: 15,
    alignItems: 'center',
  },
  signImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  characterLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  spaceContainer: {
    width: 40,
    height: 80,
    marginRight: 15,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  pronunciationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  pronunciationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  examplesContainer: {
    marginBottom: 20,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  exampleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  exampleWord: {
    fontSize: 16,
    color: '#333',
  },
  missingImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
});

export default WordToSignScreen;
