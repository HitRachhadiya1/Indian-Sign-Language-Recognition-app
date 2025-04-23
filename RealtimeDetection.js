import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";

import { Camera, CameraType } from "expo-camera";

import * as tf from "@tensorflow/tfjs";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  bundleResourceIO,
  cameraWithTensors,
} from "@tensorflow/tfjs-react-native";
import { ExpoWebGLRenderingContext } from "expo-gl";

// tslint:disable-next-line: variable-name
const TensorCamera = cameraWithTensors(Camera);

const IS_ANDROID = Platform.OS === "android";
const IS_IOS = Platform.OS === "ios";

// Camera preview size.
const CAM_PREVIEW_WIDTH = Dimensions.get("window").width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

// The size of the resized output from TensorCamera.
const OUTPUT_TENSOR_WIDTH = 192;
const OUTPUT_TENSOR_HEIGHT = 192;

// Whether to auto-render TensorCamera preview.
const AUTO_RENDER = false;

// Whether to load model from app bundle (true) or through network (false).
const LOAD_MODEL_FROM_BUNDLE = true;

// Classification threshold - only show predictions with confidence above this value
const THRESHOLD = 0.7;

const RealtimeDetection = ({ navigation }) => {
  const cameraRef = useRef(null);
  const [tfReady, setTfReady] = useState(false);
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [fps, setFps] = useState(0);
  const [orientation, setOrientation] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.front);
  // Use `useRef` so that changing it won't trigger a re-render.
  const rafId = useRef(null);
  const [labels, setLabels] = useState([]);
  const [frameCount, setFrameCount] = useState(0);
  const [currentSentence, setCurrentSentence] = useState("");
  const [lastAddedLetter, setLastAddedLetter] = useState("");
  const [autoAddEnabled, setAutoAddEnabled] = useState(false);

  useEffect(() => {
    async function prepare() {
      rafId.current = null;

      // Set initial orientation.
      const curOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(curOrientation);

      // Listens to orientation change.
      ScreenOrientation.addOrientationChangeListener((event) => {
        setOrientation(event.orientationInfo.orientation);
      });

      // Camera permission.
      await Camera.requestCameraPermissionsAsync();

      // Wait for tfjs to initialize the backend.
      await tf.ready();

      // Load the Teachable Machine model
      try {
        // Load the model and metadata
        const modelJSON = require("./newmodel/model.json");
        const modelWeights = require("./newmodel/weights.bin");
        const metadataJSON = require("./newmodel/metadata.json");

        // Set the labels from metadata
        setLabels(metadataJSON.labels);

        // Create a bundle for the model files
        const modelBundle = bundleResourceIO(modelJSON, modelWeights);

        // Load model as LayersModel (Teachable Machine uses tf.sequential)
        const teachableModel = await tf.loadLayersModel(modelBundle);

        setModel(teachableModel);
        console.log("Teachable Machine model loaded successfully");
      } catch (error) {
        console.error("Failed to load model:", error);
      }

      // Ready!
      setTfReady(true);
    }

    prepare();

    // Cleanup function
    return () => {
      if (rafId.current != null && rafId.current !== 0) {
        cancelAnimationFrame(rafId.current);
        rafId.current = 0;
      }
    };
  }, []);

  // Process each image from camera
  const handleCameraStream = async (images, updatePreview, gl) => {
    console.log("Starting camera stream");

    const loop = async () => {
      const imageTensor = images.next().value;

      if (!imageTensor) {
        rafId.current = requestAnimationFrame(loop);
        return;
      }

      // Skip frames to improve performance
      setFrameCount((prev) => prev + 1);
      if (frameCount % 2 !== 0) {
        // Process only every 2nd frame
        tf.dispose(imageTensor);

        if (!AUTO_RENDER) {
          updatePreview();
          gl.endFrameEXP();
        }

        rafId.current = requestAnimationFrame(loop);
        return;
      }

      if (model) {
        try {
          const startTs = Date.now();

          // Hand detection approach using color segmentation
          const handDetected = tf.tidy(() => {
            // Convert to grayscale
            const grayscale = imageTensor.mean(2, true);

            // Skin color detection (simplified)
            const skinMask = tf.greater(grayscale, tf.scalar(70));

            // Count pixels that are likely skin
            const skinPixels = skinMask.sum().dataSync()[0];
            const totalPixels = imageTensor.shape[0] * imageTensor.shape[1];

            // If significant portion is skin, likely a hand
            return skinPixels > totalPixels * 0.1;
          });

          // Direct processing approach (simple and reliable)
          const processedInput = tf.tidy(() => {
            // Resize to expected input size
            const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
            // Normalize
            const normalized = tf.div(tf.sub(resized, 127.5), 127.5);
            // Add batch dimension
            return normalized.expandDims(0);
          });

          // Run prediction
          const predictions = await model.predict(processedInput);
          const probabilities = await predictions.data();

          // Dispose tensors
          tf.dispose([processedInput, predictions]);

          // Find max probability
          let maxProb = 0;
          let maxIndex = -1;
          for (let i = 0; i < probabilities.length; i++) {
            if (probabilities[i] > maxProb) {
              maxProb = probabilities[i];
              maxIndex = i;
            }
          }

          // Update prediction only if we detected a hand AND confidence is high
          if (handDetected && maxProb > THRESHOLD && maxIndex < labels.length) {
            setPrediction({
              label: labels[maxIndex],
              confidence: maxProb,
            });
          } else {
            setPrediction(null);
          }

          const latency = Date.now() - startTs;
          setFps(Math.floor(1000 / latency));
          console.log("FPS:", Math.floor(1000 / latency));
        } catch (error) {
          console.error("Error during prediction:", error);
        }
      }

      // Dispose the tensor after using it
      tf.dispose(imageTensor);

      // Continue loop if not stopped
      if (rafId.current === 0) return;

      if (!AUTO_RENDER) {
        updatePreview();
        gl.endFrameEXP();
      }

      rafId.current = requestAnimationFrame(loop);
    };

    loop();
  };

  // Add the current prediction to the sentence
  const addLetterToSentence = () => {
    if (prediction && prediction.label) {
      // Only add if it's different from the last letter (to avoid duplicates)
      if (
        prediction.label !== lastAddedLetter ||
        prediction.label === "space"
      ) {
        if (prediction.label === "space") {
          setCurrentSentence((prev) => prev + " ");
        } else if (
          prediction.label === "del" ||
          prediction.label === "delete"
        ) {
          setCurrentSentence((prev) => prev.slice(0, -1));
        } else {
          setCurrentSentence((prev) => prev + prediction.label);
        }
        setLastAddedLetter(prediction.label);
      }
    }
  };

  // Clear the current sentence
  const clearSentence = () => {
    setCurrentSentence("");
    setLastAddedLetter("");
  };

  // Toggle auto-add functionality
  const toggleAutoAdd = () => {
    setAutoAddEnabled(!autoAddEnabled);
  };

  // Effect to handle auto-adding letters
  useEffect(() => {
    let autoAddTimer = null;

    if (autoAddEnabled && prediction && prediction.confidence > 0.85) {
      autoAddTimer = setTimeout(() => {
        addLetterToSentence();
      }, 800); // Wait 0.8 seconds before auto-adding
    }

    return () => {
      if (autoAddTimer) clearTimeout(autoAddTimer);
    };
  }, [prediction, autoAddEnabled]);

  const renderPrediction = () => {
    return (
      <View style={styles.predictionContainer}>
        {prediction ? (
          <>
            <Text style={styles.predictionText}>Sign: {prediction.label}</Text>
            <Text style={styles.confidenceText}>
              {(prediction.confidence * 100).toFixed(1)}%
            </Text>
          </>
        ) : (
          <Text style={styles.predictionText}>No sign detected</Text>
        )}

        <View style={styles.sentenceContainer}>
          <Text style={styles.sentenceText}>
            {currentSentence || "Your sentence will appear here"}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={addLetterToSentence}
            disabled={!prediction}
          >
            <Text style={styles.buttonText}>Add Letter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={clearSentence}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, autoAddEnabled ? styles.buttonActive : {}]}
            onPress={toggleAutoAdd}
          >
            <Text style={styles.buttonText}>
              {autoAddEnabled ? "Auto: ON" : "Auto: OFF"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFps = () => {
    return (
      <View style={styles.fpsContainer}>
        <Text>FPS: {fps}</Text>
      </View>
    );
  };

  const renderCameraTypeSwitcher = () => {
    return (
      <View
        style={styles.cameraTypeSwitcher}
        onTouchEnd={handleSwitchCameraType}
      >
        <Text>
          Switch to{" "}
          {cameraType === CameraType.front ? CameraType.back : CameraType.front}{" "}
          camera
        </Text>
      </View>
    );
  };

  const handleSwitchCameraType = () => {
    if (cameraType === CameraType.front) {
      setCameraType(CameraType.back);
    } else {
      setCameraType(CameraType.front);
    }
  };

  const isPortrait = () => {
    return (
      orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
      orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
    );
  };

  const getTextureRotationAngleInDegrees = () => {
    // On Android, the camera texture will rotate behind the scene as the phone
    // changes orientation, so we don't need to rotate it in TensorCamera.
    if (IS_ANDROID) {
      return 0;
    }

    // For iOS, the camera texture won't rotate automatically. Calculate the
    // rotation angles here which will be passed to TensorCamera to rotate it
    // internally.
    switch (orientation) {
      // Not supported on iOS as of 11/2021, but add it here just in case.
      case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        return 180;
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
        return cameraType === CameraType.front ? 270 : 90;
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        return cameraType === CameraType.front ? 90 : 270;
      default:
        return 0;
    }
  };

  const renderLandmarksButton = () => {
    return (
      <TouchableOpacity
        style={styles.landmarksButton}
        onPress={() => navigation.navigate("HandLandmarks")}
      >
        <Text style={styles.buttonText}>Hand Landmarks</Text>
      </TouchableOpacity>
    );
  };

  if (!tfReady) {
    return (
      <View style={styles.loadingMsg}>
        <Text>Loading TensorFlow.js and model...</Text>
      </View>
    );
  } else {
    return (
      <View
        style={
          isPortrait() ? styles.containerPortrait : styles.containerLandscape
        }
      >
        <TensorCamera
          ref={cameraRef}
          style={styles.camera}
          autorender={AUTO_RENDER}
          type={cameraType}
          // tensor related props
          resizeWidth={OUTPUT_TENSOR_WIDTH}
          resizeHeight={OUTPUT_TENSOR_HEIGHT}
          resizeDepth={3}
          rotation={getTextureRotationAngleInDegrees()}
          onReady={handleCameraStream}
          useCustomShadersToResize={false}
          cameraTextureHeight={OUTPUT_TENSOR_HEIGHT}
          cameraTextureWidth={OUTPUT_TENSOR_WIDTH}
        />
        {renderPrediction()}
        {renderFps()}
        {renderCameraTypeSwitcher()}
        {renderLandmarksButton()}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  containerPortrait: {
    position: "relative",
    width: CAM_PREVIEW_WIDTH,
    height: CAM_PREVIEW_HEIGHT,
    marginTop: Dimensions.get("window").height / 2 - CAM_PREVIEW_HEIGHT / 2,
  },
  containerLandscape: {
    position: "relative",
    width: CAM_PREVIEW_HEIGHT,
    height: CAM_PREVIEW_WIDTH,
    marginLeft: Dimensions.get("window").height / 2 - CAM_PREVIEW_HEIGHT / 2,
  },
  loadingMsg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  predictionContainer: {
    position: "absolute",
    bottom: 40,
    left: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    zIndex: 20,
  },
  predictionText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  confidenceText: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
  fpsContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 80,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .7)",
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },
  cameraTypeSwitcher: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 180,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .7)",
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },
  sentenceContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginVertical: 10,
    minHeight: 50,
    justifyContent: "center",
  },
  sentenceText: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: "#FF9800",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  landmarksButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    width: 160,
    alignItems: "center",
    zIndex: 20,
  },
});

export default RealtimeDetection;
