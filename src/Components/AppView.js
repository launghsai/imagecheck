import React, { useState, useContext } from 'react'
import { Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, StatusBar, View, useColorScheme, Image, TouchableOpacity, TextInput } from 'react-native'


const AppView = (props) => {

    const { children } = props

    return (
        <View style={styles.container}>
            <View style={styles.headerTab} />
            {children}
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
})

export default AppView