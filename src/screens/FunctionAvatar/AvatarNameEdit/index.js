import React, { useState } from 'react'
import { View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { AvatarNameEdit } from '../../../lib/OXO'
import { actionType } from '../../../redux/actions/actionType'
import ButtonPrimary from '../../../component/ButtonPrimary'
import InputPrimary from '../../../component/InputPrimary'
import ErrorMsg from '../../../component/ErrorMsg'
import tw from '../../../lib/tailwind'

//地址标记
const AvatarNameEditScreen = (props) => {
  const [address, setAddress] = useState(props.avatar.get('Address'))
  const [name, setName] = useState(props.avatar.get('Name'))
  const [error_msg, setMsg] = useState('')

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
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`my-auto p-25px`}>
        <InputPrimary value={address} setValue={setAddress} placeholder={`地址`} editable={false} />
        <InputPrimary value={name} setValue={setName} placeholder={`昵称`} />

        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }
        <ButtonPrimary title={'保存'} onPress={saveName} />
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