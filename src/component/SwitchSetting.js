import React from 'react'
import { View, Text } from 'react-native'
import { Switch } from '@ant-design/react-native'
import tw from '../lib/tailwind'

const SwitchSetting = ({ title, checked, onChange }) => {
  return (
    <View style={tw`bg-neutral-100 rounded-lg px-1 border-2 border-gray-300 flex flex-row justify-between py-5px px-15px`}>
      <Text style={tw`text-lg text-slate-800 text-center`} >
        {title}
      </Text>
      <Text style={tw`text-lg text-slate-800 text-center`}>
        <Switch checked={checked} onChange={onChange} />
      </Text>
    </View>
  )
}

export default SwitchSetting