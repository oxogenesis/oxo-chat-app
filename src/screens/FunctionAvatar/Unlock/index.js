import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { MasterKeyDerive } from '../../../lib/OXO'
import ErrorMsg from '../../../component/ErrorMsg'
import ButtonPrimary from '../../../component/ButtonPrimary'
import InputPrimary from '../../../component/InputPrimary'
import tw from '../../../lib/tailwind'

//解锁界面
const UnlockScreen = (props) => {
  const [master_key, setKey] = useState('')
  const [error_msg, setMsg] = useState('')

  const unlock = () => {
    MasterKeyDerive(master_key)
      .then(result => {
        if (result) {
          props.dispatch({
            type: actionType.master.setMasterKey,
            master_key: master_key
          })
          setKey('')
          setMsg('')
          props.navigation.replace('AvatarList')
        } else {
          setKey('')
          setMsg('无效口令...')
        }
      })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      if (props.master.get('MasterKey') != null) {
        // 强制安全退出：加载此页面，置空MasterKey
        props.dispatch({
          type: actionType.master.setMasterKey,
          MasterKey: null
        })
      }
      setKey('')
      setMsg('')
    })
  })

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`my-auto p-25px`}>
        <InputPrimary value={master_key} setValue={setKey} placeholder={'口令'} flagSecure={true} />

        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }

        <ButtonPrimary title={'解锁'} onPress={unlock} />
      </View>
    </View>
  )
}

const ReduxUnlockScreen = connect((state) => {
  return {
    master: state.master
  }
})(UnlockScreen)

export default ReduxUnlockScreen