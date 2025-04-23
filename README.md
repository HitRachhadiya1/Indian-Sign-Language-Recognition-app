# Sign Language Detection with TensorFlow.js and React Native

This application uses TensorFlow.js to perform real-time sign language detection through the device camera.

## Features

- Real-time sign language detection using a custom Teachable Machine model
- Camera view with ability to switch between front and back cameras
- Display of detected signs with confidence levels

## Setup

### Prerequisites

- Node.js (v14 or newer)
- Expo CLI (`npm install -g expo-cli`)
- Yarn or npm
- Expo Go app on your mobile device (for testing)

### Installation

1. Clone this repository
2. Install dependencies:

```bash
# Using npm
npm install

# OR using yarn
yarn install
```

3. Make sure the model files are correctly placed in the `model` directory:
   - `model.json`
   - `metadata.json`
   - Model weight files (\*.bin)

### Running the App

1. Start the Expo development server:

```bash
# Using npm
npm start

# OR using yarn
yarn start
```

2. Scan the QR code with the Expo Go app (Android) or the Camera app (iOS) to open the app on your device

## Project Structure

- `App.js` - Main application entry point with navigation setup
- `RealtimeDetection.js` - Component for real-time sign language detection using the camera
- `model/` - Directory containing the Teachable Machine model files

## Model Information

The sign language detection model was created using Teachable Machine. It recognizes various hand signs and displays the predictions in real-time.

## Troubleshooting

If you encounter issues:

1. Ensure all dependencies are correctly installed
2. Verify the model files are properly placed in the model directory
3. Check that camera permissions are granted to the app
4. Make sure your device supports TensorFlow.js operations
