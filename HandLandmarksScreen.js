import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import Svg, { Circle, Line } from "react-native-svg";

// Constants
const IS_ANDROID = Platform.OS === "android";
const IS_IOS = Platform.OS === "ios";
const CAM_PREVIEW_WIDTH = Dimensions.get("window").width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

// Demo hand landmarks for visualization
const DEMO_HAND_LANDMARKS = [
  // Basic hand shape with key points
  { x: CAM_PREVIEW_WIDTH * 0.5, y: CAM_PREVIEW_HEIGHT * 0.6 }, // 0: palm center
  { x: CAM_PREVIEW_WIDTH * 0.45, y: CAM_PREVIEW_HEIGHT * 0.5 }, // 1: thumb base
  { x: CAM_PREVIEW_WIDTH * 0.4, y: CAM_PREVIEW_HEIGHT * 0.45 }, // 2: thumb middle
  { x: CAM_PREVIEW_WIDTH * 0.35, y: CAM_PREVIEW_HEIGHT * 0.4 }, // 3: thumb tip
  { x: CAM_PREVIEW_WIDTH * 0.35, y: CAM_PREVIEW_HEIGHT * 0.35 }, // 4: thumb tip

  { x: CAM_PREVIEW_WIDTH * 0.5, y: CAM_PREVIEW_HEIGHT * 0.5 }, // 5: index base
  { x: CAM_PREVIEW_WIDTH * 0.5, y: CAM_PREVIEW_HEIGHT * 0.4 }, // 6: index middle
  { x: CAM_PREVIEW_WIDTH * 0.5, y: CAM_PREVIEW_HEIGHT * 0.3 }, // 7: index tip
  { x: CAM_PREVIEW_WIDTH * 0.5, y: CAM_PREVIEW_HEIGHT * 0.25 }, // 8: index tip

  { x: CAM_PREVIEW_WIDTH * 0.55, y: CAM_PREVIEW_HEIGHT * 0.5 }, // 9: middle base
  { x: CAM_PREVIEW_WIDTH * 0.55, y: CAM_PREVIEW_HEIGHT * 0.4 }, // 10: middle middle
  { x: CAM_PREVIEW_WIDTH * 0.55, y: CAM_PREVIEW_HEIGHT * 0.3 }, // 11: middle tip
  { x: CAM_PREVIEW_WIDTH * 0.55, y: CAM_PREVIEW_HEIGHT * 0.25 }, // 12: middle tip

  { x: CAM_PREVIEW_WIDTH * 0.6, y: CAM_PREVIEW_HEIGHT * 0.5 }, // 13: ring base
  { x: CAM_PREVIEW_WIDTH * 0.6, y: CAM_PREVIEW_HEIGHT * 0.4 }, // 14: ring middle
  { x: CAM_PREVIEW_WIDTH * 0.6, y: CAM_PREVIEW_HEIGHT * 0.3 }, // 15: ring tip
  { x: CAM_PREVIEW_WIDTH * 0.6, y: CAM_PREVIEW_HEIGHT * 0.25 }, // 16: ring tip

  { x: CAM_PREVIEW_WIDTH * 0.65, y: CAM_PREVIEW_HEIGHT * 0.5 }, // 17: pinky base
  { x: CAM_PREVIEW_WIDTH * 0.65, y: CAM_PREVIEW_HEIGHT * 0.4 }, // 18: pinky middle
  { x: CAM_PREVIEW_WIDTH * 0.65, y: CAM_PREVIEW_HEIGHT * 0.35 }, // 19: pinky tip
  { x: CAM_PREVIEW_WIDTH * 0.65, y: CAM_PREVIEW_HEIGHT * 0.3 }, // 20: pinky tip
];

// Hand connections for visualization
const FINGER_CONNECTIONS = [
  // Thumb connections
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  // Index finger
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  // Middle finger
  [0, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  // Ring finger
  [0, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  // Pinky
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  // Palm
  [0, 5],
  [5, 9],
  [9, 13],
  [13, 17],
];

const HandLandmarksScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [message, setMessage] = useState("Demo Hand Landmarks");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Render static hand landmarks demonstration
  const renderHandLandmarks = () => {
    if (!showLandmarks) return null;

    return (
      <View style={styles.landmarksContainer}>
        <Svg
          height="100%"
          width="100%"
          viewBox={`0 0 ${CAM_PREVIEW_WIDTH} ${CAM_PREVIEW_HEIGHT}`}
        >
          {/* Draw connections */}
          {FINGER_CONNECTIONS.map((connection, idx) => {
            const start = DEMO_HAND_LANDMARKS[connection[0]];
            const end = DEMO_HAND_LANDMARKS[connection[1]];

            return (
              <Line
                key={`line-${idx}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#00FF00"
                strokeWidth="2"
              />
            );
          })}

          {/* Draw points */}
          {DEMO_HAND_LANDMARKS.map((point, idx) => (
            <Circle
              key={`point-${idx}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={idx === 0 ? "#FF0000" : "#FFFF00"}
            />
          ))}
        </Svg>
      </View>
    );
  };

  const renderMessage = () => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );

  const renderCameraTypeSwitcher = () => (
    <View style={styles.cameraTypeSwitcher} onTouchEnd={handleSwitchCameraType}>
      <Text>Switch Camera</Text>
    </View>
  );

  const renderBackButton = () => (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.buttonText}>Back</Text>
    </TouchableOpacity>
  );

  const renderToggleLandmarksButton = () => (
    <TouchableOpacity
      style={[styles.toggleButton, showLandmarks ? styles.activeButton : {}]}
      onPress={() => setShowLandmarks(!showLandmarks)}
    >
      <Text style={styles.buttonText}>
        {showLandmarks ? "Hide Landmarks" : "Show Landmarks"}
      </Text>
    </TouchableOpacity>
  );

  const handleSwitchCameraType = () => {
    setCameraType(
      cameraType === CameraType.front ? CameraType.back : CameraType.front
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Camera access denied</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={cameraType} />
      {renderHandLandmarks()}
      {renderMessage()}
      {renderCameraTypeSwitcher()}
      {renderBackButton()}
      {renderToggleLandmarksButton()}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          This is a demonstration of hand landmarks visualization.
          {"\n"}
          It shows the 21 key points that would normally be detected on a hand.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  landmarksContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 10,
  },
  messageContainer: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, .5)",
    borderRadius: 5,
    padding: 8,
    zIndex: 20,
  },
  messageText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  cameraTypeSwitcher: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, .7)",
    borderRadius: 5,
    padding: 10,
    zIndex: 20,
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: "center",
    zIndex: 20,
  },
  toggleButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    width: 150,
    alignItems: "center",
    zIndex: 20,
  },
  activeButton: {
    backgroundColor: "#FF9800",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  infoContainer: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
    zIndex: 20,
  },
  infoText: {
    color: "white",
    textAlign: "center",
  },
});

export default HandLandmarksScreen;
