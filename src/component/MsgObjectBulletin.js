import React from 'react'
import { View, Text } from 'react-native'
import tw from '../lib/tailwind'

const MsgObjectBulletin = ({ object }) => {
  return (
    <View style={tw`flex flex-row bg-stone-100 dark:bg-stone-500 p-5px mb-1px`}>
      <View style={tw`rounded-full px-1 border-2 border-gray-300 bg-blue-300 dark:border-gray-700 dark:bg-blue-700`}>
        <Text style={tw`text-2xl font-bold text-slate-800 dark:text-slate-200 text-left`}>
          {`${object.Name}#${object.Sequence}`}
        </Text>
      </View>
    </View>
  )
}

export default MsgObjectBulletin