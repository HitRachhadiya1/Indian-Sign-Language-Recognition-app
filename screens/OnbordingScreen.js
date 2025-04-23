import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React from 'react';
import metrics from '../utils/metrics';
import Button from '../components/Button';

const OnbordingScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" />

      <Image
        source={require('../assets/nexa.jpeg')}
        style={styles.logoContainer}
      />
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTxt}>Welcome to Nexa</Text>
      </View>
      <View style={styles.txtContainer}>
        <Text style={styles.txt}>
          Connect with friends, discover new communities, and share your life
          with others.
        </Text>
      </View>
      <TouchableOpacity style={styles.signWithContainer} activeOpacity={0.6}>
        <Image
          source={require('../assets/google.png')}
          style={styles.googleImg}
        />
        <Text style={styles.signupTxt}>Sign up with Google</Text>
      </TouchableOpacity>
      <View style={styles.orContainer}>
        <View
          style={{
            height: metrics.HEIGHT * 0.01,
            width: metrics.WIDTH * 0.4,
            borderBottomWidth: 0.5,
            borderBottomColor: '#989898',
          }}
        />
        <Text style={styles.orTxt}>or</Text>
        <View
          style={{
            height: metrics.HEIGHT * 0.01,
            width: metrics.WIDTH * 0.4,
            borderBottomWidth: 0.5,
            borderBottomColor: '#989898',
          }}
        />
      </View>
      <Button buttonTitle={'Create an Account'} />
      <View style={styles.signInCotainer}>
        <Text style={styles.alreadyAccountTxt}>Already have an accout?</Text>
        <TouchableOpacity activeOpacity={0.6}>
          <Text style={styles.signInTxt}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: '15%',
  },
  logoContainer: {
    height: metrics.HEIGHT * 0.17,
    width: metrics.WIDTH * 0.25,
  },
  welcomeContainer: {
    width: metrics.WIDTH * 0.65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTxt: {
    color: '#000',
    fontSize: 42,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginTop: '3%',
  },
  txtContainer: {
    width: metrics.WIDTH * 0.75,
    alignItems: 'center',
    marginTop: '5%',
  },
  txt: {
    fontSize: 20,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    color: '#727272',
  },
  signWithContainer: {
    backgroundColor: '#eeeeee',
    marginTop: '19%',
    width: metrics.WIDTH * 0.85,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: '9%',
    borderWidth: 0.4,
    borderColor: '#eeeeee',
    paddingVertical: '3%',
    borderRadius: 14,
  },
  googleImg: {
    width: metrics.WIDTH * 0.09,
    height: metrics.HEIGHT * 0.04,
  },
  signupTxt: {
    color: '#000',
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginLeft: '17%',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '6%',
  },
  orTxt: {
    color: '#000',
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    marginHorizontal: '3%',
  },
  createAccount: {
    backgroundColor: '#6835f0',
    marginTop: '7%',
    width: metrics.WIDTH * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.4,
    borderColor: '#6835f0',
    paddingVertical: '3%',
    borderRadius: 14,
  },
  createAccountTxt: {
    color: '#fff',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  signInCotainer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    flexDirection: 'row',
  },
  alreadyAccountTxt: {
    color: '#000',
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
  },
  signInTxt: {
    color: '#6835f0',
    fontSize: 15,
    marginLeft: '8%',
    fontFamily: 'Roboto-Medium',
  },
});

export default OnbordingScreen;
