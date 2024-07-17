import React, { useState, useContext } from 'react'
import { Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, StatusBar, View, useColorScheme, Image, TouchableOpacity, TextInput, Modal,ActivityIndicator } from 'react-native'
import AppText from './AppText';


const AppView = (props) => {


  const [modalvisible, setModalvisible] = useState(true);
    const { children, loading } = props

    return (
        <View style={styles.container}>
            <View style={styles.headerTab} />
            {children}
            <Modal visible={loading} transparent={true} style={styles.modalContainer}>
                <View style={styles.modalBox}>
                    <View style={{ width: 100, height: 100, backgroundColor:'white' , borderRadius: 5,justifyContent:'center',alignItems:'center' }}>
                      <ActivityIndicator size='large' color={'lightblue'} />
                    </View>
                </View>
            </Modal>
        </View>
    )

}

const styles = StyleSheet.create({

    container: {
        flex: 1
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
        flex: 1,
        backgroundColor: 'white',
        margin: 3,
      }
})

export default AppView