import React from 'react'
import { Text, View } from 'react-native'
import tw from '../lib/tailwind'

export default function ErrorMsg(props) {
  return (
    <Text style={tw`text-base text-red-500 text-center`}>{props.error_msg}</Text>
  )
}
