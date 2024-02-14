import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import tw from '../lib/tailwind'

const LoadingView = ({ msg = '加载中...' }) => {
  return (
    <View style={tw`my-auto m-auto`}>
      <Text style={tw`text-2xl text-green-500`}>{msg}</Text>
      <ActivityIndicator size="large" color={tw.color('bg-green-500')} />
    </View>
  )
}

export default LoadingView