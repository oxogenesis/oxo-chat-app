import React from 'react'
import { Image } from 'react-native'
import { styles } from '../theme/style'

export default function AvatarImage(props) {
  return (
    <Image style={styles.img_md} defaultSource={require('../assets/app.png')} source={{ uri: `https://www.gravatar.com/avatar/${props.address}?s=${50}&d=retro&r=g` }} resizeMode='stretch'></Image>
  )
}
