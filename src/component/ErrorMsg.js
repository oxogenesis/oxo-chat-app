import React from 'react'
import { Text, View } from 'react-native'
import tw from 'twrnc'

export default function ErrorMsg(props) {
  return (
    <View>
      <Text style={tw`text-base text-red-500`}>{props.error_msg}</Text>
    </View>
  )
}
