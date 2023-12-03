import React from 'react'
import { Text, View } from 'react-native'
import tw from 'twrnc'

export default function LinkBulletin(props) {
  return (
    <View style={tw.style(`bg-yellow-500 rounded-full px-1 border-2 border-gray-300`)}>
      <Text
        style={tw.style(`text-base text-slate-800 text-center`)}
        onPress={props.onPress}>
        {`${props.name}#${props.sequence}`}
      </Text>
    </View>
  )
}
