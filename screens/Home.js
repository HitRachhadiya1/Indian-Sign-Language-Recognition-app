import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import metrics from "../utils/metrics";

const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.appName}>NEXA Translator</Text>
        {/* <TouchableOpacity
          style={styles.profileButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Profile")}
        >
          <Icon name="account-circle" size={30} color="#6C63FF" />
        </TouchableOpacity> */}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hello!</Text>
          <Text style={styles.welcomeSubtext}>
            Welcome to NEXA, your sign language companion
          </Text>
        </View>

        <Text style={styles.featuresTitle}>Choose a Feature</Text>

        <TouchableOpacity
          style={styles.featureCard}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("WordToSignScreen")}
        >
          <View style={styles.featureImageContainer}>
            <Image
              source={require("../assets/wmremove-transformed.jpeg")}
              style={styles.featureImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.featureContent}>
            <View style={styles.featureIconContainer}>
              <Icon name="gesture" size={24} color="#fff" />
            </View>
            <Text style={styles.featureTitle}>Word to Sign</Text>
            <Text style={styles.featureDescription}>
              Convert text into sign language visuals. Type a word and see its
              sign language representation.
            </Text>
            <View style={styles.startButtonContainer}>
              <Text style={styles.startButtonText}>Get Started</Text>
              <Icon name="arrow-right" size={20} color="#6C63FF" />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <View style={styles.featureImageContainer}>
            <Image
              source={require("../assets/realtimetranslator.png")}
              style={styles.featureImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.featureContent}>
            <View
              style={[
                styles.featureIconContainer,
                { backgroundColor: "#FF6584" },
              ]}
            >
              <Icon name="camera" size={24} color="#fff" />
            </View>
            <Text style={styles.featureTitle}>Real-time Detection</Text>
            <Text style={styles.featureDescription}>
              Use your camera to detect and translate sign language gestures in
              real-time.
            </Text>
            <View style={styles.startButtonContainer}>
              <Text style={styles.startButtonText}>Get Started</Text>
              <Icon name="arrow-right" size={20} color="#6C63FF" />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Icon name="information-outline" size={24} color="#6C63FF" />
          <Text style={styles.infoText}>
            Learn sign language faster with our AI-powered recognition system
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    elevation: 2,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  profileButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  welcomeSection: {
    marginTop: 25,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  welcomeSubtext: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    lineHeight: 22,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  featureImageContainer: {
    height: 180,
    width: "100%",
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  featureImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  featureContent: {
    padding: 20,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  startButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6C63FF",
    marginRight: 5,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8E6FF",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    marginLeft: 10,
    lineHeight: 20,
  },
});

export default Home;
