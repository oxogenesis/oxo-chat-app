import React, { useState } from 'react'
import { View, TextInput } from 'react-native'
import { AvatarCreateNew } from '../../../lib/OXO'
import { connect } from 'react-redux'
import ButtonPrimary from '../../../component/ButtonPrimary'
import InputPrimary from '../../../component/InputPrimary'
import ErrorMsg from '../../../component/ErrorMsg'
import tw from '../../../lib/tailwind'

//口令创建账户
const AvatarCreateScreen = (props) => {
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
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`my-auto p-25px`}>
        <InputPrimary value={name} setValue={setName} placeholder={`昵称`} />

        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }

        <ButtonPrimary title={'本地生成'} onPress={createAvatar} />
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