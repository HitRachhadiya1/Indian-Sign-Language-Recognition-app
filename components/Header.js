import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import metrics from '../utils/metrics';

const Header = () => {
  return (
    <View>
      <TouchableOpacity style={styles.container}>
        <Icon
          size={26}
          color="black"
          name="arrowleft"
          style={{marginLeft: '4%'}}
        />
        <Text style={styles.txt}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: metrics.WIDTH * 1,
    marginTop: '4%',
    flexDirection: 'row',
  },
  txt: {
    color: '#000',
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    marginLeft: '5%',
  },
});
