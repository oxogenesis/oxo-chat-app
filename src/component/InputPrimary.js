import React from 'react'
import { TextInput } from 'react-native'
import tw from '../lib/tailwind'

const InputPrimary = ({ placeholder, value, setValue, editable = true, flagSecure = false, textSize = 'text-base' }) => {
  return (
    <TextInput
      style={tw`mx-5px rounded-full border-solid border border-neutral-300 ${textSize} text-center`}
      placeholder={placeholder}
      placeholderTextColor={tw.color('neutral-500')}
      secureTextEntry={flagSecure}
      multiline={false}
      editable={editable}
      value={value}
      onChangeText={text => setValue(text)}
    />
  )
}

export default InputPrimary