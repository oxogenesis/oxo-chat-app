import React from 'react'
import { Image } from 'react-native'
import tw from 'twrnc'

export default function AvatarImage(props) {
  return (
    <Image
      style={tw.style(`h-50px w-50px border-2 border-gray-300`)}
      defaultSource={require('../assets/app.png')}
      source={{ uri: `https://www.gravatar.com/avatar/${props.address}?s=${50}&d=retro&r=g` }}
      resizeMode='stretch'>
    </Image>
  )
}
