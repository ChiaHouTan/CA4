import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Modal, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function CameraPage() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const camRef = useRef(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  async function takePicture() {
    if (camRef) {
      const photo = await camRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri);
      setOpen(true);
      console.log(photo);
    }
  }

  async function selectPicture() {
    const gallery = await ImagePicker.launchImageLibraryAsync();

  }


  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={type}
        ref={camRef}>

        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", margin: 20 }}>
        //Gallery Button
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}
            onPress={selectPicture}
          >
            <Ionicons
              name="ios-photos"
              style={{ color: "#fff", fontSize: 40 }}
            />
          </TouchableOpacity>
          //Take Camera Button
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}
            onPress={takePicture}
          >
            <FontAwesome
              name="camera"
              style={{ color: "#fff", fontSize: 40 }}
            />
          </TouchableOpacity>
          //Swap Camera Button
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <MaterialCommunityIcons
              name="camera-switch"
              style={{ color: "#fff", fontSize: 40 }}
            />

          </TouchableOpacity>
        </View>
      </Camera>

      {capturedPhoto &&
        <Modal
          animationType="slide"
          transparent={false}
          visible={open}
        >
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => setOpen(false)}
            >
              <FontAwesome name="window-close" size={50} color="#f00" />
            </TouchableOpacity>

            <Image
              style={{ width: '100%', height: '90%', borderRadius: 20 }}
              source={{ uri: capturedPhoto }}

            />
          </View>
        </Modal>
      }
    </View>
  );
}