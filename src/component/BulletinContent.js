import React from 'react'
import { View, Text } from 'react-native'
import tw from '../lib/tailwind'

const BulletinContent = ({ content, onPress }) => {
  return (
    // <View style={tw`flex flex-row mr-50px rounded-r-lg rounded-bl-lg bg-neutral-200`}>
    <View style={tw`mx-5px mb-5px rounded-r-lg rounded-bl-lg bg-neutral-200`}>
      <Text style={tw`w-full p-5px text-base text-neutral-800`}
        onPress={onPress}
      >{content}</Text>
    </View>
  )
}

export default BulletinContent