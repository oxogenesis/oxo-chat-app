import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import tw from '../lib/tailwind'

const ButtonPrimary = ({ title = '确定', bg = 'bg-green-500', onPress }) => {
  return (
    <TouchableOpacity style={tw`mx-5px my-1px rounded-full border border-stone-700 dark:border-stone-300 ${bg}`} onPress={onPress}>
      <Text style={tw`h-10 text-lg text-center align-middle font-bold text-slate-200`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default ButtonPrimary