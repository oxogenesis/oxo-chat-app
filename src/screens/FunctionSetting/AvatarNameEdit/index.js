import React, { useContext, useState } from 'react'
import { View, Text, TextInput } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { AvatarNameEdit } from '../../../lib/OXO'
import { actionType } from '../../../redux/actions/actionType'
import { WhiteSpace, Button } from '@ant-design/react-native'
import { ThemeContext } from '../../../theme/theme-context'
import ErrorMsg from '../../../component/ErrorMsg'
import tw from 'twrnc'

//地址标记
const AvatarNameEditScreen = (props) => {
  const [address, setAddress] = useState(props.avatar.get('Address'))
  const [name, setName] = useState(props.avatar.get('Name'))
  const [error_msg, setMsg] = useState('')
  const { theme } = useContext(ThemeContext)

  const saveName = () => {
    let newName = name.trim()
    if (name == '') {
      setMsg('name could not be blank...')
      return
    }
    AvatarNameEdit(newName, props.avatar.get('Seed'),
      props.master.get('MasterKey'))
      .then(result => {
        if (result) {
          setName('')
          setMsg('')
          props.dispatch({
            type: actionType.avatar.setAvatarName,
            name: newName
          })
          props.navigation.goBack()
        }
      })
  }

  return (
    <View style={tw`h-full bg-stone-200`}>
      <View style={tw`my-auto`}>
        <TextInput
          placeholderTextColor={tw.color('stone-500')}
          style={tw`rounded-full border-solid border-2 border-gray-300 text-base text-center`}
          placeholder="地址"
          value={address}
          editable={false}
          multiline={false}
          onChangeText={text => setAddress(text)}
        />
        <TextInput
          placeholderTextColor={tw.color('stone-500')}
          style={tw`rounded-full border-solid border-2 border-gray-300 text-base text-center`}
          placeholder="昵称"
          value={name}
          multiline={false}
          onChangeText={text => setName(text)}
        />
        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }
        <Button style={tw`rounded-full bg-green-500`} onPress={saveName}>
          <Text style={tw`text-xl text-slate-100`}>保存</Text>
        </Button>
      </View>
    </View>
  )
}

const ReduxAvatarNameEditScreen = connect((state) => {
  return {
    master: state.master,
    avatar: state.avatar
  }
})(AvatarNameEditScreen)

//export default AvatarNameEditScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAvatarNameEditScreen{...props} navigation={navigation} route={route} />
}