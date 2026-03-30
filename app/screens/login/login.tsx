import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [storedEmail, setStoredEmail] = useState<string | null>(null);
  const [storedPassword, setStoredPassword] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Load stored credentials
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const userEmail = await SecureStore.getItemAsync("userEmail");
        const userPassword = await SecureStore.getItemAsync("userPassword");

        setStoredEmail(userEmail);
        setStoredPassword(userPassword);
      } catch (error) {
        console.log("Error loading credentials", error);
      }
    };

    loadCredentials();
  }, []);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }

    if (!password) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    try {
      if (storedEmail === email && storedPassword === password) {
        Alert.alert("Success", "Login successful");
      } else {
        Alert.alert("Error", "Invalid credentials");
      }

      // Optionally save credentials
      await SecureStore.setItemAsync("userEmail", email);
      await SecureStore.setItemAsync("userPassword", password);

    } catch (error) {
      Alert.alert("Error", "Failed to process login");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your Login</Text>
      <Text style={styles.subtitle}>Please enter your login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
