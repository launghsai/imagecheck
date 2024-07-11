import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, Button, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// import OpenCV from './src/NativeModules/Opencv';
import OpenCV from './src/NativeModules/OpenCV';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppView from './src/Components/AppView';
import AppText from './src/Components/AppText';
import ImgToBase64 from 'react-native-image-base64';
import ImageResizer from 'react-native-image-resizer';
import ImageSize from 'react-native-image-size'
// import cv from 'opencv.js';


export default function MainPage({ navigation }) {

  const imageRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUrlbase, setImageUrlbase] = useState(null);
  const [imagedisplay, setImagedisplay] = useState(null);
  const [resultImage_1, setResultImage_1] = useState(null);
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
  const [result_4, setResult_4] = useState({});
  const [first, setFirst] = useState(true);
  const [time_1, setTime_1] = useState('');
  const [time_2, setTime_2] = useState('');
  const [time_3, setTime_3] = useState('');
  const [modalvisible, setModalvisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finalresult, setFinalresult] = useState(false);

  const checkForBlurryMaxLaplacian = (imagedata) => {
    return new Promise((resolve, reject) => {
      OpenCV.CheckBlurryMaxLaplacian(imagedata, (error, data) => {
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
  const checkBlurryGradientMagnitude = (imageAsBase64) => {
    return new Promise((resolve, reject) => {
      OpenCV.CheckBlurryGradientMagnitude(imageAsBase64, (error, data) => {

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
        resolve(result);
      });
    });
  }
  const convertdataCannyEdge = (imageAsBase64) => {
    return new Promise((resolve, reject) => {
      OpenCV.convertImageCannyEdge(imageAsBase64, (error, result) => {
        resolve(result);
      });
    });
  }
  const getMyImage = (imageAsBase64) => {
    return new Promise((resolve, reject) => {
      OpenCV.convertMYImage(imageAsBase64, (error, result) => {
        resolve(result);
      });
    });
  }
  const getMyDetection = (imageAsBase64) => {
    return new Promise((resolve, reject) => {
      OpenCV.MyDetection(imageAsBase64, (error, result) => {
        resolve(result);
      });
    });
  }

  let checkImageall = async (image) => {
    try {

      // let isok = await getImagesize(imageUrlbase)
      // if (!isok) {
      //   alert('รูปภาพขนาดเล็กเกินไป')
      //   return
      // }
      let maxlaplacian = {
        image: image,
        threshold: 200 // กำหนดเป็น 200
      }
      const startTime = performance.now();
      let Maxlapliacian = await checkForBlurryMaxLaplacian(maxlaplacian)
      let gradient = await checkBlurryGradientMagnitude(image)
      const secondTime = performance.now();
      let Variance = await checkForBlurryVarianceLaplacian(image)
      const ThirdTime = performance.now();
      let cannyedge = await checkForBlurryCannyEdge(image)
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;
      console.log(elapsedTime, " elapsedTime")
      // setTime_1(`${parseFloat(elapsedTime)?.toFixed(2)} ms`)
      setTime_1(`${parseFloat(secondTime - startTime)?.toFixed(2)} ms`)
      setTime_2(`${parseFloat(ThirdTime - secondTime)?.toFixed(2)} ms`)
      setTime_3(`${parseFloat(endTime - ThirdTime)?.toFixed(2)} ms`)
      console.log(Maxlapliacian, " lapliacian")
      console.log(Variance, " Variance")
      console.log(cannyedge, " cannyedge")
      console.log(gradient, " gradient")
      setResult_1(Maxlapliacian)
      setResult_2(Variance)
      setResult_3(cannyedge)
      setResult_4(gradient)
      // ถ้า cannyedge เบลอ เท่ากับ blur เลย
      // ถ้า cannyedge ไม่เบลอ เช็ค Variance ถ้าเบลอ เท่ากับเบลอ
      // นอกนั้นไม่เบลอ
      // if (cannyedge?.isBlur) {
      //   setFinalresult(true)
      // } else if (Variance?.isBlur) {
      //   setFinalresult(true)
      // } else {
      //   setFinalresult(false)
      // }

      // ถ้า อันใดอันหนึ่งเบลอ เท่ากับ เบลอ...ไม่เบลอทั้งสองถึงจะชัด
      if (Variance?.isBlur || cannyedge?.isBlur || gradient?.isBlur) {
        setFinalresult(true)
      } else {
        setFinalresult(false)
      }
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
  const resizeAsync = async (url, width, height, quality, sizelimit) => {
    let respond = await resizeimage(url, width, height, quality, sizelimit)
    console.log(respond, " respond")
    if (respond) {
      let base64String = await ImgToBase64.getBase64String(respond.uri).then(base64String => {
        return { data: base64String, size: Math.ceil(respond.size / 1000) };
      }).catch(err => console.log(err));

      return new Promise((resolve, reject) => {
        Image.getSize(respond.uri, (_height, _width) => {
          respond.width = width;
          respond.height = height;
          respond.base64String = base64String;
          resolve(respond);
        })

      })
    } else {
      // Alert.alert(`ไม่สามารถแนบไฟล์ path นี้ได้`);
      return false;
    }
  }
  const resizeimage = async (url, width, height, quality, sizelimit) => {
    console.log(width, " width")
    console.log(height, " height")
    console.log(quality, " quality")
    console.log(sizelimit, " sizelimit")
    console.log(url, " url")
    return ImageResizer.createResizedImage(url, width, height, 'JPEG', quality).then((response) => {
      console.log(response, " GG JA")
      if (response.size > sizelimit) {
        if (quality < 1) {
          return;
        }
        return resizeimage(url, width, height, quality - 10);
      }
      else {
        return response;
      }
    }).catch((err) => {
      console.log(err)
    });
  }


  useEffect(() => {
    checkpermission()
  }, [])

  useEffect(() => {
    if (imageUrlbase) {
      processImage(imageUrlbase)
      setFirst(false)
    }
  }, [imageUrlbase])

  const displayPress = () => {
    setModalvisible(true)
  }
  const processImage = async (base64) => {
    let result = await checkimagepassed(base64)
    if (result) {
      checkImageall(base64)
      convertimg(base64)
      setImagedisplay(base64)
    } else {
      alert('รูปภาพมีขนาดเล็กเกินไป !!')
    }


  }

  const checkimagepassed = async (base64) => {
    const uri = `data:image/jpeg;base64,${base64}`;
    const { width, height } = await ImageSize.getSize(uri);
    console.log(width, " WIDTH")
    console.log(height, " HEIGHT")
    if (width < 400 && height < 400) {
      return false
    } else {
      return true
    }
  }

  const handleImagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
      if (result?.canceled) {
        console.log('User canceled image picker');
        return;
      }
      if (result?.assets[0]?.uri) {
        setImageUrl(result.assets[0].uri);
        setImageUrlbase(result.assets[0].base64)
        // let res  = await resizeAsync(result.assets[0].uri, 1000, 1000, 90, 600 * 1000)
        // console.log(res,  " image response")
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
      // console.log(result, " result")
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
        let canny = await convertdataCannyEdge(image)
        let myimage = await getMyImage(image)
        // console.log(myimage, " IMAGE JS")
        // let detection = await getMyDetection(imageUrlbase)
        // console.log(myimage, " myimage ja")
        setResultImage_1(myimage?.base64_one)
        setResultImage_2(canny)
        // setResultImage_2(detection?.edgesBase64)



        // setResultImage(myimage?.base64_one)
        // setResultImage_2(myimage?.base64_grey)
        // console.log(myimage?.variance, " variance")
        // console.log(myimage?.stddev, " variance")
        // console.log(myimage?.mean, " mean")
      }

    } catch (error) {
      setResultImage_1(null)
      setResultImage_2(null)
    }
  }

  const checkImageQuality = async (base64Data) => {
    try {
      const response = await fetch(`data:image/png;base64,${base64Data}`); // Assuming PNG format
      // const blob = await response.blob();
      const imageBlob = await response.blob();
      const image = await window.createImageBitmap(imageBlob);

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      const imageData = context.getImageData(0, 0, image.width, image.height);
      const data = imageData.data;
      let sum = 0;
      let sqSum = 0;

      for (let i = 0; i < data.length; i += 4) {
        // Convert grayscale (assuming the data is RGBA)
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        sum += gray;
        sqSum += gray * gray;
      }

      const mean = sum / (data.length / 4);
      const variance = sqSum / (data.length / 4) - mean * mean;
      console.log('pixel variance :', variance)
      // setVariance(variance);

      const threshold = 400; // Adjust this threshold as needed
      // setIsLowQuality(variance < threshold);
    } catch (error) {
      console.log(error, " ERROR JA")
    }

  };


  return (
    <AppView>
      <View style={styles.container}>
        <View style={styles.imageBox}>
          {imagedisplay && (
            <Image ref={imageRef} source={{ uri: 'data:image/jpeg;base64,' + imagedisplay }} style={styles.image} />
          )}
          {/* {imageUrlbase && (
            <Image ref={imageRef} source={{ uri: 'data:image/jpeg;base64,' + imageUrlbase }} style={styles.image} />
          )} */}
        </View>
        <View style={styles.rowBox}>
          <TouchableOpacity onPress={handleImagePick} style={styles.pickedbutton}>
            <Text style={{ color: 'white' }} >Pick Image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImageCamera} style={styles.pickedbutton}>
            <Text style={{ color: 'white' }} >Take Photo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rowBox}>
          <TouchableOpacity
            onPress={displayPress}
            style={styles.pickedbutton}>
            <Text style={{ color: 'white' }} >Display Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { navigation.navigate('Detection') }}
            style={styles.pickedbutton}>
            <Text style={{ color: 'white' }} >Detection</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 10 }} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{
            width: '100%',
            backgroundColor: 'white'

          }}>
            <View style={styles.horiBox}>

              <View style={styles.contentBox}>
                <View style={[styles.contentItem, { backgroundColor: 'green' }]}>
                  <AppText white bold>Gradient Mag</AppText>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>BLURRY :</AppText>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    {
                      result_4?.isBlur !== undefined &&
                      <AppText style={{ color: result_4.isBlur ? 'green' : 'red' }} bold>{result_4.isBlur ? "TRUE" : "FALSE"}</AppText>
                    }
                  </View>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>Result :</AppText>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>{result_4?.variance?.toFixed(2) || ''}</AppText>
                  </View>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>Threshold :</AppText>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>{result_4?.blurThreshold || ''}</AppText>
                  </View>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>Time :</AppText>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>{time_1 || ''}</AppText>
                  </View>
                </View>
              </View>
              {/* <View style={styles.contentBox}>
                <View style={[styles.contentItem, { backgroundColor: 'green' }]}>
                  <AppText white bold>Max-Laplacian</AppText>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>BLURRY :</AppText>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <AppText style={{ color: result_1.isBlur ? 'green' : 'red' }} bold>{result_1.isBlur ? "TRUE" : "FALSE"}</AppText>
                  </View>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>Result :</AppText>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>{result_1?.maxLap || ''}</AppText>
                  </View>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>Threshold :</AppText>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>{result_1?.threshold || ''}</AppText>
                  </View>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>Time :</AppText>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>{time_1 || ''}</AppText>
                  </View>
                </View>
              </View> */}
              <View style={styles.contentBox}>
                <View style={[styles.contentItem, { backgroundColor: 'green' }]}>
                  <AppText white bold>Variance Laplacian</AppText>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>BLURRY :</AppText>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    {
                      result_2?.isBlur !== undefined &&
                      <AppText style={{ color: result_2.isBlur ? 'green' : 'red' }} bold>{result_2.isBlur ? "TRUE" : "FALSE"}</AppText>

                    }
                  </View>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>Result :</AppText>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>{result_2?.variance?.toFixed(3) || ''}</AppText>
                  </View>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>Threshold :</AppText>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>{result_2?.blurThreshold || ''}</AppText>
                  </View>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>Time :</AppText>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>{time_2 || ''}</AppText>
                  </View>
                </View>
              </View>
              <View style={styles.contentBox}>
                <View style={[styles.contentItem, { backgroundColor: 'green' }]}>
                  <AppText white bold>Canny Edge Detection</AppText>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>BLURRY :</AppText>
                  </View>
                  <View style={{ flex: 0.6 }}>
                    {
                      result_3?.isBlur !== undefined &&
                      <AppText style={{ color: result_3.isBlur ? 'green' : 'red' }} bold>{result_3.isBlur ? "TRUE" : "FALSE"}</AppText>

                    }
                  </View>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>Result :</AppText>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>{result_3?.edgeDensity?.toFixed(5) || ''}</AppText>
                  </View>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>Threshold :</AppText>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>{result_3?.threshold || ''}</AppText>
                    {/* <AppText bold>{result_3?.totalPixels|| ''}</AppText> */}
                  </View>
                </View>
                <View style={[styles.contentItem, { flexDirection: 'row', borderBottomWidth: 0.5, paddingHorizontal: 10 }]}>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>Time :</AppText>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <AppText bold>{time_3 || ''}</AppText>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ width: '100%', height: 60, alignItems: 'center' }}>
              <AppText style={{ color: finalresult ? 'red' : 'green' }} bold> FINAL RESULT :{finalresult ? "BLUR" : "NOT BLUR"}</AppText>
            </View>
          </View>

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
      <Modal visible={modalvisible} transparent={true} style={styles.modalContainer}>
        <View style={styles.modalBox}>
          <View style={{ width: '95%', height: '95%', backgroundColor: 'white', borderRadius: 5, padding: 10 }}>
            <View style={styles.modalImageBox}>
              <Image style={{ flex: 1 }} source={{ uri: 'data:image/jpeg;base64,' + resultImage_1 }} resizeMode='center' />
            </View>
            <View style={styles.modalImageBox}>
              <Image style={{ flex: 1 }} source={{ uri: 'data:image/jpeg;base64,' + resultImage_2 }} resizeMode='center' />
            </View>
          </View>
          <TouchableOpacity onPress={() => { setModalvisible(false) }} style={{ height: 40, width: 60, backgroundColor: 'aqua', justifyContent: 'center', alignItems: 'center', marginTop: 20, borderRadius: 50 }}>
            <AppText>Close</AppText>
          </TouchableOpacity>
        </View>
      </Modal>
    </AppView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    // backgroundColor: 'silver'
  },
  headerTab: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 60,
    backgroundColor: '#0060ba',
    marginBottom: 5,
    width: '100%',
  },
  image: {
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
    marginBottom: 20
  },
  showimage: {
    width: 200,
    height: 200,
    margin: 2
  },
  horiBox: {
    flexDirection: 'row',
    // backgroundColor: 'lightblue',
    width: '100%'
  },
  contentBox: {
    flex: 1,
    borderColor: 'sliver',
    borderWidth: 1,
    height: 400,
    marginHorizontal: 2,
    marginVertical: 10,
  },
  contentItem: {
    width: 'auto',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'green',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  modalBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00000050',
    padding: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalImageBox: {
    // width:'80%',
    // height:
    flex: 1,
    backgroundColor: 'white',
    margin: 3,
  }
});
