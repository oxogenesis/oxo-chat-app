import React from 'react'
import { View, Text } from 'react-native'
import tw from '../lib/tailwind'

const ViewEmpty = ({ msg = '暂无数据' }) => {
  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800`}>
      <Text style={tw`my-auto m-auto text-4xl text-slate-800 dark:text-slate-200`}>{msg}</Text>
    </View>
  )
}

export default ViewEmpty