import React, { useState } from "react";
import { View, Button, Image, StyleSheet, Text } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export default function CameraOrGallery() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  // Request gallery permission
  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  };

  // Pick image from gallery
  const pickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      alert("Gallery permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Capture photo
  const takePhoto = async (cameraRef: any) => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setImageUri(photo.uri);
      setShowCamera(false);
    }
  };

  let cameraRef: any = null;

  // Permission handling
  if (!cameraPermission) {
    return <View />;
  }

  if (!cameraPermission.granted && !showCamera) {
    return (
      <View style={styles.container}>
        <Button title="Allow Camera" onPress={requestCameraPermission} />
        <Button title="Open Camera" onPress={() => setShowCamera(true)} />
        <Button title="Pick from Gallery" onPress={pickImage} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Buttons */}
      {!showCamera && (
        <>
          <Button title="Open Camera" onPress={() => setShowCamera(true)} />
          <Button title="Pick from Gallery" onPress={pickImage} />
        </>
      )}

      {/* Camera View */}
      {showCamera && (
        <View style={{ flex: 1 }}>
          <CameraView
            style={{ flex: 1 }}
            ref={(ref) => (cameraRef = ref)}
          />
          <Button title="Capture Photo" onPress={() => takePhoto(cameraRef)} />
          <Button title="Close Camera" onPress={() => setShowCamera(false)} />
        </View>
      )}

      {/* Preview Image */}
      {imageUri && !showCamera && (
        <View style={styles.preview}>
          <Text>Selected Image:</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  preview: {
    marginTop: 20,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});
