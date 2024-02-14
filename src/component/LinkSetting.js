import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Icon } from '@ant-design/react-native'
import tw from '../lib/tailwind'

const LinkSetting = ({ title, textSize, icon, onPress }) => {
  let text_size = textSize || 'text-lg'
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={tw`bg-neutral-100 rounded-lg px-1 border-2 border-gray-300 flex flex-row justify-between py-5px px-15px`}>
        <Text style={tw`${text_size} text-slate-800 text-center`} >
          {`${title}`}
        </Text>
        <Text style={tw`text-lg text-slate-800 text-center`}>
          <Icon name={icon || 'right'} size="md" />
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default LinkSetting