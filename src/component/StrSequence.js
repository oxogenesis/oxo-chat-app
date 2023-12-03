import React from 'react'
import { Text, View } from 'react-native'
import tw from 'twrnc'

export default function StrSequence(props) {
  return (
    <View style={tw.style(`rounded-full px-1 border-2 border-gray-300`)}>
      <Text style={tw.style(`text-base text-slate-800 text-center`)}>
        {`#${props.sequence}`}
      </Text>
    </View>
  )
}
