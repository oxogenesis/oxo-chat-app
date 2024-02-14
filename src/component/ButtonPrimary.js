import React from 'react'
import { Text } from 'react-native'
import { Button } from '@ant-design/react-native'
import tw from '../lib/tailwind'

const ButtonPrimary = ({ title = '确定', bg = 'bg-green-500', onPress }) => {
  return (
    <Button style={tw`mx-5px rounded-full ${bg}`} onPress={onPress}>
      <Text style={tw`text-lg font-bold text-slate-200`}>{title}</Text>
    </Button>
  )
}

export default ButtonPrimary