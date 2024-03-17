import React from 'react'
import { View, Image, Text } from 'react-native'
import tw from '../lib/tailwind'

export default function AvatarImage(props) {
  return (
    <View>
      <Image
        style={tw`h-50px w-50px border-2 border-gray-300 dark:border-gray-700`}
        defaultSource={require('../assets/defult_avatar.png')}
        source={{ uri: `https://www.gravatar.com/avatar/${props.address}?s=${50}&d=retro&r=g` }}
        resizeMode='stretch'>
      </Image>
      {
        props.count &&
        <Text style={tw`absolute top-0 right-0 bg-red-500 rounded-full text-slate-200 p-2px text-xs`}>
          {props.count}
        </Text>
      }
    </View>

  )
}
