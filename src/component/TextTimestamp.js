import React from 'react'
import { View, Text } from 'react-native'
import { timestamp_format } from '../lib/Util'
import tw from '../lib/tailwind'

const TextTimestamp = ({ timestamp, textSize = 'text-xs' }) => {
  return (
    <View style={tw`rounded-full px-1 border border-gray-400`}>
      <Text style={tw`${textSize} text-gray-500 text-left`}>
        {timestamp_format(timestamp)}
      </Text>
    </View>
  )
}

export default TextTimestamp