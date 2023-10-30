import React from 'react'
import { Image, TouchableOpacity } from 'react-native'
import { styles } from '../theme/style'

export default function Avatar(props) {
  // console.log(props)
  return (
    <TouchableOpacity
      onPress={props.onPress}
    >
      <Image style={styles.img_md} defaultSource={require('../assets/app.png')} source={{ uri: `https://www.gravatar.com/avatar/${props.address}?s=${50}&d=retro&r=g` }}></Image>
    </TouchableOpacity>
  )
}
