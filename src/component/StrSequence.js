import React from 'react'
import { Text, View } from 'react-native'
import tw from '../lib/tailwind'

const StrSequence = ({ sequence }) => {
  return (
    <View style={tw`rounded-full px-1 border-2 border-gray-300 dark:border-gray-700`}>
      <Text style={tw`text-base text-slate-800 dark:text-slate-200 text-center`}>
        {`#${sequence}`}
      </Text>
    </View>
  )
}

export default StrSequence