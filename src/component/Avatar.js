import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import AvatarImage from './AvatarImage'

export default function Avatar(props) {
  return (
    <View>
      <TouchableOpacity onPress={props.onPress}>
        <AvatarImage address={props.address} />
      </TouchableOpacity>
    </View>
  )
}
