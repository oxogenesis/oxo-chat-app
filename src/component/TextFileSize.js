import React from 'react'
import { View, Text } from 'react-native'
import { filesize_format } from '../lib/Util'
import tw from '../lib/tailwind'

const TextFileSize = ({ size, textSize = 'text-xs' }) => {
  return (
    <View style={tw`my-auto rounded-full px-1 border border-gray-400`}>
      <Text style={tw`${textSize} font-bold text-left align-middle`}>
        {filesize_format(size)}
      </Text>
    </View>
  )
}

export default TextFileSize