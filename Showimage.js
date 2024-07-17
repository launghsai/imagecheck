import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, Button, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import AppText from './src/Components/AppText';
import ImageViewer from 'react-native-image-zoom-viewer';

const Showimage = ({ navigation, route }) => {

  const [data, setData] = useState([])
  // console.log(route?.params, " navigation HERE")

  const backpress = () => {
    navigation.goBack();
  }

  useEffect(() => {
    setData(route?.params?.image || [])
  }, [])

  const renderItem = ({ item, i }) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <View style={styles.itembox}>
          <Image source={{ uri: 'data:image/jpeg;base64,' + item.data }} style={styles.image} />
        </View>
        <AppText>{Math.ceil(item.size / 1000)} KB || width: {item.width} || height: {item.height}</AppText>
      </View>

    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={backpress} style={styles.button}>
        <AppText white >Back</AppText>
      </TouchableOpacity>
      <View style={styles.mainBox}>
        {
          data &&
          <FlatList
            data={data}
            // horizontal={true}
            // numColumns={1}
            style={{ flex: 1, }}
            renderItem={renderItem}
            keyExtractor={(item, i) => (i.toString())}
          />
        }

      </View>

    </View>
  )
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: 'white'
  },
  button: {
    width: 120,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainBox: {
    flex: 1,
    backgroundColor: 'white'
  },
  itembox: {
    // flex: 1,
    width: 600,
    height: 400,
    // width: 300,
    // height: 300,
    backgroundColor: 'silver',
    borderRadius: 2,
    borderWidth: 1,
    margin: 2
  },
  image: {
    flex: 1
  }

})

export default Showimage