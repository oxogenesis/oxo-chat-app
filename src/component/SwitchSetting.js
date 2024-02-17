import React from 'react'
import { View, Text } from 'react-native'
import { Switch } from '@ant-design/react-native'
import tw from '../lib/tailwind'

const SwitchSetting = ({ title, checked, onChange }) => {
  return (
    <View style={tw`bg-neutral-100 dark:bg-neutral-600 rounded-lg px-1 border-2 border-gray-300 dark:border-gray-700 flex flex-row justify-between py-5px px-15px`}>
      <Text style={tw`text-lg text-slate-800 dark:text-slate-200 text-center`} >
        {title}
      </Text>
      <Text style={tw`text-lg text-center`}>
        <Switch checked={checked} onChange={onChange} />
      </Text>
    </View>
  )
}

export default SwitchSetting