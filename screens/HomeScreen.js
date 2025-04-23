import { StyleSheet, Text, View } from "react-native";
import React from "react";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          fontSize: 20,
          padding: 20,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Sign Language Detection Using TensorFlow.js
      </Text>
      <Text
        style={{
          padding: 16,
          backgroundColor: "#007AFF",
          color: "white",
          borderRadius: 8,
        }}
        onPress={() => navigation.navigate("RealtimeDetection")}
      >
        Start Real-time Detection
      </Text>
    </View>
  );
};

export default HomeScreen;
