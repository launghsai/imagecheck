import React, { useState, useContext } from 'react'
import { Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, StatusBar, View, useColorScheme, Image, TouchableOpacity, TextInput } from 'react-native'


const AppText = (props) => {

    const { children, bold, l, s,white,style } = props

    return (
        <View>
            <Text
                style={[styles.textStyle,
                bold && { fontWeight: 'bold' },
                l && { fontSize: 22 },
                s && { fontSize: 15 },
                white && { color:'white' },
                style && style
                ]}



            >{children}</Text>

        </View>
    )

}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 18,

    }
})

export default AppText