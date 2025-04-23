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
} from 'react-native';
import React, {useState} from 'react';
import Header from '../components/Header';
import metrics from '../utils/metrics';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Registration = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Phone number, 2: OTP verification, 3: User details

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderPhoneNumberStep = () => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Join us today!</Text>
        <Text style={styles.subtitle}>
          Enter your phone number to create an account
        </Text>

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

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => setStep(2)}>
          <Text style={styles.registerButtonText}>Get OTP</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderOtpStep = () => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Verify Your Number</Text>
        <Text style={styles.subtitle}>
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

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => setStep(3)}>
          <Text style={styles.registerButtonText}>Verify</Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.loginText}>Didn't receive OTP? </Text>
          <TouchableOpacity>
            <Text style={styles.loginLink}>Resend</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderUserDetailsStep = () => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Please fill in the details to create your account
        </Text>

        <Text style={styles.inputLabel}>Full Name</Text>
        <View style={styles.inputWrapper}>
          <Icon
            name="account"
            size={20}
            color="#6C63FF"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="#AAAAAA"
            value={name}
            onChangeText={setName}
          />
        </View>

        <Text style={styles.inputLabel}>Date of Birth</Text>
        <View style={styles.inputWrapper}>
          <Icon
            name="calendar"
            size={20}
            color="#6C63FF"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#AAAAAA"
            value={dob}
            onChangeText={setDob}
          />
        </View>

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
            placeholder="Create a strong password"
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

        <Text style={styles.passwordRequirements}>
          Password must be at least 8 characters with uppercase, lowercase, and
          special characters
        </Text>

        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => setStep(2)}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderPhoneNumberStep();
      case 2:
        return renderOtpStep();
      case 3:
        return renderUserDetailsStep();
      default:
        return renderPhoneNumberStep();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 30,
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
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
  eyeIcon: {
    padding: 5,
  },
  passwordRequirements: {
    fontSize: 12,
    color: '#888',
    marginTop: -10,
    marginBottom: 30,
    marginLeft: 4,
  },
  registerButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6C63FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  backButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default Registration;
