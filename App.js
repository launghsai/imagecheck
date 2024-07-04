import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// import OpenCV from './src/NativeModules/Opencv';
import OpenCV from './src/NativeModules/OpenCV';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainPage from './MainPage';
import DetectionPage from './DetectionPage';
// import { useNavigation } from '@react-navigation/native-stack';
// import cv from 'opencv.js';

const Stack = createNativeStackNavigator();
export default function App({ }) {



  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="MainPage" component={MainPage} options={{ headerShown: false }} initial />
        <Stack.Screen name="Detection" key={'Detection'} component={DetectionPage}  options={{ headerShown: false }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'silver'
  },
  image: {
    // width: 200,
    // height: 200,
    flex: 1,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttoncheck: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    width: 200,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  rowBox: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  pickedbutton: {
    width: 300,
    borderRadius: 5,
    backgroundColor: 'green',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2
  },
  imageBox: {
    width: 400,
    height: 400,
    borderWidth: 5,
    borderRadius: 5,
    borderColor: 'green',
    borderStyle: 'dashed',
    padding: 2,
    marginBottom: 2
  },
  showimage: {
    width: 200,
    height: 200,
    margin: 2
  }
});
