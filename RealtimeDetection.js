import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Dimensions, Platform } from "react-native";
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useTensorflowModel } from "react-native-fast-tflite";
import { useResizePlugin } from "vision-camera-resize-plugin";
import { Worklets } from "react-native-worklets-core";

const HandDetection = () => {
  // Get camera devices
  const devices = useCameraDevices();
  const device = devices.back;

  // State for hand detections
  const [detections, setDetections] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load the TFLite model
  const handModel = useTensorflowModel(
    require("./assets/hand_detection_model.tflite")
  );

  // Get resize plugin
  const { resize } = useResizePlugin();

  // Create a worklet to update React state from the frame processor
  const updateDetections = Worklets.createRunInJsFn((newDetections) => {
    setDetections(newDetections);
  });

  // Define the frame processor
  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";

      // Skip if we're already processing a frame or model isn't loaded
      if (isProcessing || handModel.state !== "loaded") return;

      try {
        // Mark as processing
        setIsProcessing(true);

        // 1. Resize the camera frame to match model input dimensions
        // Adjust these values to match your specific model's requirements
        const resized = resize(frame, {
          scale: {
            width: 192, // Adjust based on your model's input size
            height: 192, // Adjust based on your model's input size
          },
          pixelFormat: "rgb",
          dataType: "uint8",
        });

        // 2. Run the model
        const outputs = handModel.model.runSync([resized]);

        // 3. Process outputs based on your model's specific output format
        // The following is an example for a model with similar output to the SSD object detection model
        // You'll need to adjust this based on your specific model's output format

        const detection_boxes = outputs[0]; // Bounding boxes [y1, x1, y2, x2]
        const detection_scores = outputs[1]; // Confidence scores
        const num_detections = outputs[3]
          ? outputs[3][0]
          : detection_scores.length;

        const handDetections = [];

        // Process detections
        for (let i = 0; i < num_detections; i++) {
          const confidence = detection_scores[i];

          // Filter by confidence threshold
          if (confidence > 0.5) {
            // You can adjust this threshold
            // Extract bounding box coordinates
            // Note: Some models output [y1, x1, y2, x2], others [x1, y1, x2, y2]
            // Adjust index access based on your model's output format
            const boxIndex = i * 4;
            const y1 = detection_boxes[boxIndex];
            const x1 = detection_boxes[boxIndex + 1];
            const y2 = detection_boxes[boxIndex + 2];
            const x2 = detection_boxes[boxIndex + 3];

            handDetections.push({
              boundingBox: {
                x: x1,
                y: y1,
                width: x2 - x1,
                height: y2 - y1,
              },
              confidence,
            });
          }
        }

        // Update state in React thread
        updateDetections(handDetections);
      } catch (error) {
        console.error("Error processing frame:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [handModel.state, isProcessing]
  );

  // Render bounding boxes over detected hands
  const renderDetections = () => {
    const { width, height } = Dimensions.get("window");

    return detections.map((detection, index) => {
      // Convert normalized coordinates to screen coordinates
      const x = detection.boundingBox.x * width;
      const y = detection.boundingBox.y * height;
      const w = detection.boundingBox.width * width;
      const h = detection.boundingBox.height * height;

      return (
        <View
          key={`detection-${index}`}
          style={[
            styles.detectionBox,
            {
              left: x,
              top: y,
              width: w,
              height: h,
            },
          ]}
        >
          <Text style={styles.detectionText}>
            {`Hand ${(detection.confidence * 100).toFixed(0)}%`}
          </Text>
        </View>
      );
    });
  };

  // Camera permission state
  const [hasPermission, setHasPermission] = useState(false);

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "authorized");
    })();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Camera permission is required for hand detection</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5} // Process 5 frames per second for better performance
      />

      {renderDetections()}

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {handModel.state === "loaded" ? "Model loaded" : "Loading model..."}
        </Text>
        <Text style={styles.infoText}>
          {`Detected: ${detections.length} hands`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  detectionBox: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "yellow",
    backgroundColor: "transparent",
  },
  detectionText: {
    backgroundColor: "yellow",
    color: "black",
    fontSize: 14,
    padding: 2,
  },
  infoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  infoText: {
    color: "white",
    fontSize: 14,
  },
});

export default HandDetection;
