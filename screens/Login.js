import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import metrics from '../utils/metrics';

const Login = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginWithOtp = () => {
    // Here you would implement OTP sending logic
    setOtpSent(true);
  };

  const handleSignIn = () => {
    // Here you would implement authentication logic
    // For now, simply navigate to the Home screen
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  const renderPhoneInput = () => {
    return (
      <>
        <Text style={styles.inputLabel}>Phone Number</Text>
        <View style={styles.inputWrapper}>
          <Icon
            name="phone"
            size={20}
            color="#6C63FF"
            style={styles.inputIcon}
          />
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder="9876543210"
            placeholderTextColor="#AAAAAA"
            keyboardType="phone-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
      </>
    );
  };

  const renderPasswordInput = () => {
    return (
      <>
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputWrapper}>
          <Icon
            name="lock"
            size={20}
            color="#6C63FF"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#AAAAAA"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}>
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#6C63FF"
            />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderOtpInput = () => {
    return (
      <>
        <Text style={styles.inputLabel}>OTP</Text>
        <Text style={styles.otpSentText}>
          We've sent an OTP to +91 {phoneNumber}
        </Text>
        <View style={styles.otpContainer}>
          <TextInput
            style={styles.otpInput}
            placeholder="Enter OTP"
            placeholderTextColor="#AAAAAA"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive OTP? </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          {/* <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          /> */}
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Sign in to continue your journey with NEXA
          </Text>
        </View>

        <View style={styles.inputContainer}>
          {renderPhoneInput()}

          {!isOtpMode && renderPasswordInput()}

          {isOtpMode && otpSent && renderOtpInput()}

          {!isOtpMode && (
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          {!isOtpMode && !otpSent && (
            <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
          )}

          {isOtpMode && !otpSent && (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLoginWithOtp}>
              <Text style={styles.loginButtonText}>Get OTP</Text>
            </TouchableOpacity>
          )}

          {isOtpMode && otpSent && (
            <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
              <Text style={styles.loginButtonText}>Verify OTP</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.switchLoginModeContainer}
            onPress={() => {
              setIsOtpMode(!isOtpMode);
              setOtpSent(false);
            }}>
            <Text style={styles.switchLoginModeText}>
              {isOtpMode ? 'Login with Password' : 'Login with OTP'}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Registration')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '85%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 55,
  },
  countryCode: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
    fontWeight: '500',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  otpSentText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    marginLeft: 4,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  otpInput: {
    fontSize: 18,
    letterSpacing: 5,
    textAlign: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingHorizontal: 15,
    height: 55,
    width: '100%',
    color: '#333',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '600',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  switchLoginModeContainer: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  switchLoginModeText: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '600',
  },
});

export default Login;
