import React from 'react'
import { TouchableOpacity } from 'react-native'
import AvatarImage from './AvatarImage'

export default function Avatar(props) {
  return (
    <TouchableOpacity onPress={props.onPress}    >
      <AvatarImage address={props.address} />
    </TouchableOpacity>
  )
}
