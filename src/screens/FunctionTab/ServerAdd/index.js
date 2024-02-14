import React, { useState } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import ButtonPrimary from '../../../component/ButtonPrimary'
import InputPrimary from '../../../component/InputPrimary'
import ErrorMsg from '../../../component/ErrorMsg'
import tw from '../../../lib/tailwind'

//网络设置
const ServerAddScreen = (props) => {
  const [host_input, setHost] = useState('')
  const [error_msg, setMsg] = useState('')

  const addHost = () => {
    let host_input1 = host_input.trim()
    let regx = /^ws[s]?:\/\/.+/
    let rs = regx.exec(host_input1)
    if (rs == null) {
      setMsg('服务器地址格式无效...')
    } else {
      props.dispatch({
        type: actionType.avatar.addHost,
        host: host_input1
      })
      setHost('')
      setMsg('')
      props.navigation.goBack()
    }
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`my-auto p-25px`}>
        <InputPrimary value={host_input} setValue={setHost} placeholder={'ws://或者wss://'} />

        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }

        <ButtonPrimary title={'添加'} onPress={addHost} />
      </View >
    </View >
  )
}

const ReduxServerAddScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(ServerAddScreen)

export default ReduxServerAddScreen