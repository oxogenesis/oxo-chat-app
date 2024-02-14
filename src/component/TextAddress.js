import React from 'react'
import { View, Text } from 'react-native'
import tw from '../lib/tailwind'

const TextAddress = ({ address, textSize = 'text-sm' }) => {
  return (
    <Text style={tw`${textSize} text-gray-500 text-left`}>
      {address}
    </Text>
  )
}

export default TextAddress