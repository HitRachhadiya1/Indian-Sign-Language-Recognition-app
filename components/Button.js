import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import metrics from '../utils/metrics';

const Button = ({buttonTitle}) => {
  return (
    <View>
      <TouchableOpacity style={styles.createAccount} activeOpacity={0.6}>
        <Text style={styles.createAccountTxt}>{buttonTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default Button;
