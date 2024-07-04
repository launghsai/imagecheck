import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// import OpenCV from './src/NativeModules/Opencv';
import OpenCV from './src/NativeModules/OpenCV';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import cv from 'opencv.js';


export default function App() {

  const imageRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUrlbase, setImageUrlbase] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [resultImage_2, setResultImage_2] = useState(null);
  const [message, setMessage] = useState('Select an image');
  const [isblur, setIsblur] = useState(false);
  const [text, setText] = useState('');
  const [text_1, setText_1] = useState('');
  const [text_2, setText_2] = useState('');
  const [color, setColor] = useState('blue');
  const [result_1, setResult_1] = useState({});
  const [result_2, setResult_2] = useState({});
  const [result_3, setResult_3] = useState({});
  const [first, setFirst] = useState(true);
  const [time, setTime] = useState('');

  const checkForBlurryMaxLaplacian = (imageAsBase64) => {
    return new Promise((resolve, reject) => {
      OpenCV.CheckBlurryMaxLaplacian(imageAsBase64, (error, data) => {
        resolve(data);
      });
    });
  }
  const checkForBlurryImageMixed = (imageAsBase64) => {
    return new Promise((resolve, reject) => {
      OpenCV.isImageBlurryMixedFunction(imageAsBase64, (error, data) => {
        resolve(data);
      });
    });
  }
  const checkForBlurryVarianceLaplacian = (imageAsBase64) => {
    return new Promise((resolve, reject) => {
      OpenCV.CheckBlurryVarianceOfLaplacian(imageAsBase64, (error, data) => {

        resolve(data);
      });
    });
  }
  const checkForBlurryCannyEdge = (imageAsBase64) => {
    return new Promise((resolve, reject) => {
      OpenCV.CheckBlurryCannyEdge(imageAsBase64, (error, data) => {
        resolve(data);
      });
    });
  }

  const convertdata = (imageAsBase64) => {
    return new Promise((resolve, reject) => {
      OpenCV.convertImageLaplacian(imageAsBase64, (error, result) => {
        // console.log(result, "Result")
        resolve(result);
      });
    });
  }
  const convertdataCannyEdge = (imageAsBase64) => {
    return new Promise((resolve, reject) => {
      OpenCV.convertImageCannyEdge(imageAsBase64, (error, result) => {
        // console.log(result, "Result")
        resolve(result);
      });
    });
  }
  const getMyImage = (imageAsBase64) => {
    return new Promise((resolve, reject) => {
      OpenCV.convertMYImage(imageAsBase64, (error, result) => {
        // console.log(result, "Result")
        resolve(result);
      });
    });
  }
  const getMyDetection = (imageAsBase64) => {
    return new Promise((resolve, reject) => {
      OpenCV.MyDetection(imageAsBase64, (error, result) => {
        // console.log(result, "Result")
        resolve(result);
      });
    });
  }

  let checkImageall = async (image) => {
    try {
      const startTime = performance.now();
      let Maxlapliacian = await checkForBlurryMaxLaplacian(image)
      let Variance = await checkForBlurryVarianceLaplacian(image)
      let cannyedge = await checkForBlurryCannyEdge(image)
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;
      console.log(elapsedTime, " elapsedTime")
      setTime(`${parseFloat(elapsedTime).toFixed(2)} ms`)
      console.log(Maxlapliacian, " lapliacian")
      console.log(Variance, " Variance")
      console.log(cannyedge, " cannyedge")
      setResult_1(Maxlapliacian)
      setResult_2(Variance)
      setResult_3(cannyedge)
    } catch (error) {
      console.log(error, " ERROR")
    }
  }

  const checkpermission = async () => {
    let status = await ImagePicker.getCameraPermissionsAsync()
    if (!status.granted) {
      ImagePicker.requestCameraPermissionsAsync()
    }

  }


  useEffect(() => {
    checkpermission()
  }, [])

  useEffect(() => {
    if (imageUrlbase) {
      checkImageall(imageUrlbase)
      convertimg(imageUrlbase)
      setFirst(false)
    }
  }, [imageUrlbase])


  const handleImagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (result?.canceled) {
        console.log('User canceled image picker');
        return;
      }
      if (result?.assets[0]?.uri) {
        setImageUrl(result.assets[0].uri);
        setImageUrlbase(result.assets[0].base64)
      }
    } catch (error) {
      console.error(error, " ERROR")
    }

  };
  const handleImageCamera = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.7,
      });
      console.log(result, " result")
      if (result?.canceled) {
        console.log('User canceled image picker');
        return;
      }
      if (result?.assets[0]?.uri) {
        setImageUrl(result.assets[0].uri);
        setImageUrlbase(result.assets[0].base64)
      }

    } catch (error) {
      console.error(error, " ERROR")
    }

  };
  const convertimg = async (image) => {
    try {
      if (image) {
        // let data = await convertdata(imageUrlbase)
        let canny = await convertdataCannyEdge(imageUrlbase)
        let myimage = await getMyImage(imageUrlbase)
        let detection = await getMyDetection(imageUrlbase)

        setResultImage(detection?.database64)
        setResultImage_2(detection?.edgesBase64)



        // setResultImage(myimage?.base64_one)
        // setResultImage_2(myimage?.base64_grey)
        // console.log(myimage?.variance, " variance")
        // console.log(myimage?.stddev, " variance")
        // console.log(myimage?.mean, " mean")
      }

    } catch (error) {
      setResultImage(null)
      setResultImage_2(null)
    }
  }

  // const checkForBlurryImage = (imageAsBase64) => {
  //   return new Promise((resolve, reject) => {
  //     OpenCV.checkForBlurryImage(imageAsBase64, (error, dataArray) => {
  //       resolve(dataArray[0]);
  //     });
  //   });
  // }
  // 


  return (
    <View style={styles.container}>
      <View style={styles.imageBox}>
        {imageUrlbase && (
          <Image ref={imageRef} source={{ uri: 'data:image/jpeg;base64,' + imageUrlbase }} style={styles.image} />
        )}
      </View>
      <View style={styles.rowBox}>
        <TouchableOpacity onPress={handleImagePick} style={styles.pickedbutton}>
          <Text style={{ color: 'white' }} >Pick Image</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleImageCamera} style={styles.pickedbutton}>
          <Text style={{ color: 'white' }} >Take Photo</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.rowBox}>
        <TouchableOpacity
          //  onPress={convertimg} 
          style={styles.pickedbutton}>
          <Text style={{ color: 'white' }} >Convert Image</Text>
        </TouchableOpacity>
      </View> */}
      <View style={{ marginVertical: 15 }} />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'blue', marginVertical: 5 }}>LAPLACIAN   -   Time:{time}</Text>
          <View style={{flexDirection:'row'}}>
          <View style={styles.showimage}>
            {resultImage && (
              <Image ref={imageRef} source={{ uri: 'data:image/jpeg;base64,' + resultImage }} style={styles.image} />
            )}
          </View>
          <View style={styles.showimage}>
            {resultImage && (
              <Image ref={imageRef} source={{ uri: 'data:image/jpeg;base64,' + resultImage_2 }} style={styles.image} />
            )}
          </View>
          </View>
         
          <View style={{ paddingVertical: 5, borderWidth: 1 }}>
            <Text style={{ fontSize: 22, color: 'green', fontWeight: 'bold', marginVertical: 5 }}>MaxLaplacian</Text>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
              <Text style={{ fontSize: 18, color: 'green', fontWeight: 'bold', marginVertical: 5 }}>isBlur : {result_1.isBlur?"BLUR":"NOT BLUR"}</Text>
              <Text style={{ fontSize: 18, color: 'green', fontWeight: 'bold', marginVertical: 5 }}>maxLap : {result_1?.maxLap}</Text>
              <Text style={{ fontSize: 18, color: 'green', fontWeight: 'bold', marginVertical: 5 }}>threshold : {result_1?.threshold}</Text>
            </View>
          </View>
          <View style={{ paddingVertical: 5, borderWidth: 1 }}>
            <Text style={{ fontSize: 22, color: 'green', fontWeight: 'bold', marginVertical: 5 }}>VarianceLaplacian</Text>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
              <Text style={{ fontSize: 18, color: 'green', fontWeight: 'bold', marginVertical: 5 }}>isBlur : {result_2.isBlur?"BLUR":"NOT BLUR"}</Text>
              <Text style={{ fontSize: 18, color: 'green', fontWeight: 'bold', marginVertical: 5 }}>variance : {result_2?.variance}</Text>
              <Text style={{ fontSize: 18, color: 'green', fontWeight: 'bold', marginVertical: 5 }}>blurThreshold : {result_2?.blurThreshold}</Text>
            </View>
          </View>
          <View style={{ paddingVertical: 5, borderWidth: 1 }}>
            <Text style={{ fontSize: 22, color: 'green', fontWeight: 'bold', marginVertical: 5 }}>CannyEdge</Text>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
              <Text style={{ fontSize: 18, color: 'green', fontWeight: 'bold', marginVertical: 5 }}>isBlur : {result_3.isBlur?"BLUR":"NOT BLUR"}</Text>
              <Text style={{ fontSize: 18, color: 'green', fontWeight: 'bold', marginVertical: 5 }}>edgeDensity : {result_3?.edgeDensity}</Text>
              <Text style={{ fontSize: 18, color: 'green', fontWeight: 'bold', marginVertical: 5 }}>edgePixels : {result_3?.edgePixels}</Text>
              <Text style={{ fontSize: 18, color: 'green', fontWeight: 'bold', marginVertical: 5 }}>totalPixels : {result_3?.totalPixels}</Text>
            </View>
          </View>


          {/* <Text style={{ fontSize: 22, color: 'green', fontWeight: 'bold', marginVertical: 5 }}>VarianceLaplacian : {result_2 ? 'Blur' : 'Not Blur'}</Text>
          <Text style={{ fontSize: 22, color: 'green', fontWeight: 'bold', marginVertical: 5 }}>CannyEdge : {result_3 ? 'Blur' : 'Not Blur'}</Text> */}
          {/* {
            !result_1 ?
              <Text style={{ fontSize: 22, color: 'green', fontWeight: 'bold' }}>CLEARED</Text>
              :
              <Text style={{ fontSize: 22, color: 'red', fontWeight: 'bold' }}>BLURRY</Text>
          } */}

        </View>

        {/* <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'blue' }}>CANNY EDGE</Text>
          <View style={styles.showimage}>
            {resultImage_2 && (
              <Image ref={imageRef} source={{ uri: 'data:image/jpeg;base64,' + resultImage_2 }} style={styles.image} />
            )}
          </View>
          {
            !result_2 ?
              <Text style={{ fontSize: 18, color: 'green' }}>PASS</Text>
              :
              <Text style={{ fontSize: 18, color: 'red' }}>BLUR</Text>
          }
        </View> */}

      </View>
      {/* <View style={{ flexDirection: 'row' }}>
        <View style={styles.showimage}>
          {resultImage && (
            <Image ref={imageRef} source={{ uri: 'data:image/jpeg;base64,' + resultImage }} style={styles.image} />
          )}
        </View>
        <View style={styles.showimage}>
          {resultImage && (
            <Image ref={imageRef} source={{ uri: 'data:image/jpeg;base64,' + resultImage }} style={styles.image} />
          )}
        </View>
      </View> */}

    </View>
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
