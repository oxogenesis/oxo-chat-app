import React from 'react'
import { View, Text } from 'react-native'
import tw from '../lib/tailwind'

const TextName = ({ name }) => {
  return (
    <View style={tw`rounded-full px-1 border-2 border-gray-300 dark:border-gray-700`}>
      <Text style={tw`text-base text-slate-800 dark:text-slate-200 text-left`}>
        {name}
      </Text>
    </View>
  )
}

export default TextName