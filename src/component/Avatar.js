import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import AvatarImage from './AvatarImage'
import tw from 'twrnc'

export default function Avatar(props) {
  return (
    <TouchableOpacity onPress={props.onPress}    >
      <AvatarImage address={props.address} />
    </TouchableOpacity>
  )
}
