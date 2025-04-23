import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as tf from "@tensorflow/tfjs";
import { Camera, CameraType } from "expo-camera";

// Import screens
import RealtimeDetection from "./RealtimeDetection";
import Home from "./screens/Home";
import HomeScreen from "./screens/HomeScreen";
import WordToSignScreen from "./screens/WordToSignScreen";

// Create navigation stack
const Stack = createStackNavigator();

// Home screen component

// App component with navigation
export default function App() {
  const [tfReady, setTfReady] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize TensorFlow.js and get camera permission
    const setupTF = async () => {
      try {
        // Get camera permission
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(status === "granted");

        // Initialize TensorFlow.js
        await tf.ready();
        setTfReady(true);

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing:", error);
        setIsLoading(false);
      }
    };

    setupTF();
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading resources...</Text>
      </View>
    );
  }

  // Permission denied screen
  if (hasCameraPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Camera permission is required to use this app.</Text>
      </View>
    );
  }

  // Main app with navigation
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WordToSignScreen"
          component={WordToSignScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RealtimeDetection"
          component={RealtimeDetection}
          options={{ title: "Real-time Detection" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
