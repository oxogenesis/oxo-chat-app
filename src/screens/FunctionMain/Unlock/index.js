import React, { useContext, useState, useEffect } from 'react'
import { View, Text, TextInput } from 'react-native'
import { Button } from '@ant-design/react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { MasterKeyDerive } from '../../../lib/OXO'
import { ThemeContext } from '../../../theme/theme-context'
import ErrorMsg from '../../../component/ErrorMsg'
import tw from 'twrnc'

//解锁界面
const UnlockScreen = (props) => {
  const { theme } = useContext(ThemeContext)
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
    <View style={tw`h-full bg-stone-200`}>
      <View style={tw.style(`my-auto`)}>
        <TextInput
          placeholderTextColor={tw.color('stone-500')}
          style={tw.style(`rounded-full border-solid border-2 border-gray-300 text-base text-center`)}
          secureTextEntry={true}
          placeholder="口令"
          value={master_key}
          onChangeText={text => setKey(text)}
        />
        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }
        <Button style={tw.style(`rounded-full bg-green-500`)} onPress={unlock}>
          <Text style={tw.style(`text-xl text-slate-100`)}>解锁</Text>
        </Button>
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