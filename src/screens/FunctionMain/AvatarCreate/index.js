import React, { useContext, useState } from 'react'
import { View, Text, TextInput } from 'react-native'
import { Button } from '@ant-design/react-native'
import { AvatarCreateNew } from '../../../lib/OXO'
import { connect } from 'react-redux'
import { ThemeContext } from '../../../theme/theme-context'
import tw from 'twrnc'

//口令创建账户
const AvatarCreateScreen = (props) => {
  const { theme } = useContext(ThemeContext)
  const [name, setName] = useState('')
  const [error_msg, setMsg] = useState('')

  const createAvatar = () => {
    if (name == '') {
      setMsg('昵称不能为空...')
      return
    }
    AvatarCreateNew(name, props.master.get('MasterKey'))
      .then(result => {
        if (result) {
          setMsg('')
          setName('')
          props.navigation.goBack()
        }
      })
  }

  return (
    <View style={tw`h-full bg-stone-200`}>
      <View style={tw.style(`my-auto`)}>
        <TextInput
          placeholder="昵称"
          placeholderTextColor={tw.color('stone-500')}
          style={tw.style(`rounded-full border-solid border-2 border-gray-300 text-base text-center`)}
          value={name}
          onChangeText={text => setName(text)}
        />
        {
          error_msg.length > 0 &&
          <View>
            <Text style={tw.style('text-base', 'text-red-500')}>{error_msg}</Text>
          </View>
        }
        <Button style={tw.style(`rounded-full bg-green-500`)} onPress={() => createAvatar()}>
          <Text style={tw.style(`text-xl text-slate-100`)}>本地生成</Text>
        </Button>
      </View>
    </View>
  )

}

const ReduxAvatarCreateScreen = connect((state) => {
  return {
    master: state.master
  }
})(AvatarCreateScreen)

export default ReduxAvatarCreateScreen