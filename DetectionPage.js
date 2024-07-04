import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// import OpenCV from './src/NativeModules/Opencv';
import OpenCV from './src/NativeModules/OpenCV';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppView from './src/Components/AppView';
import AppText from './src/Components/AppText';



const DetectionPage = ({ navigation }) => {

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


    useEffect(() => {
        checkpermission()
    }, [])

    useEffect(() => {
        if (imageUrlbase) {
            //   checkImageall(imageUrlbase)
            //   convertimg(imageUrlbase)
            setFirst(false)
        }
    }, [imageUrlbase])


    const checkpermission = async () => {
        let status = await ImagePicker.getCameraPermissionsAsync()
        if (!status.granted) {
            ImagePicker.requestCameraPermissionsAsync()
        }

    }

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



    return (
        <AppView>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.backbutton}>
                    <AppText white bold >BACK</AppText>
                </TouchableOpacity>
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
                <View style={{ marginVertical: 15 }} />
                <View style={{ flexDirection: 'row' }}>


                </View>

            </View>
        </AppView>


    )
}

export default DetectionPage


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
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
    },
    backbutton: {
        width: 100,
        height: 50,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'flex-start'
    }
});