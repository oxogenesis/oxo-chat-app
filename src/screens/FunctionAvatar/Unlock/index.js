import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { MasterKeyDerive, AvatarDerive } from '../../../lib/OXO'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ErrorMsg from '../../../component/ErrorMsg'
import ButtonPrimary from '../../../component/ButtonPrimary'
import InputPrimary from '../../../component/InputPrimary'
import LoadingView from '../../../component/LoadingView'
import tw from '../../../lib/tailwind'

//解锁界面
const UnlockScreen = (props) => {
  const [master_key, setKey] = useState('')
  const [error_msg, setMsg] = useState('')
  const [flagLoading, setFlagLoading] = useState(false)

  const enableAvatar = (address, name, avatar_list) => {
    setFlagLoading(true)
    let avatar = avatar_list.filter(item => item.Address == address)[0]
    console.log(avatar)
    AvatarDerive(avatar.save, master_key)
      .then(result => {
        if (result) {
          props.dispatch({
            type: actionType.avatar.enableAvatar,
            seed: result,
            name: name
          })
        } else {
          setFlagLoading(false)
        }
      })
  }

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

          if (props.master.get('Singleton') == undefined || props.master.get('Singleton') == false) {
            props.navigation.replace('AvatarList')
          } else {
            try {
              AsyncStorage.getItem('<#Avatars#>').then(result => {
                if (result != null) {
                  let avatar_list = JSON.parse(result)
                  let address = props.master.get('Singleton')
                  let name = ''
                  for (let i = 0; i < avatar_list.length; i++) {
                    const avatar = avatar_list[i];
                    if (avatar.Address == address) {
                      name = avatar.Name
                    }
                  }
                  enableAvatar(address, name, avatar_list)
                }
              })
            } catch (e) {
              console.log(e)
            }
          }
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

  useEffect(() => {
    if (props.avatar.get('Database') != null) {
      props.navigation.replace('TabHome')
    }
  }, [props.avatar])

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      {flagLoading == false ?
        <View style={tw`my-auto p-25px`}>
          <InputPrimary value={master_key} setValue={setKey} placeholder={'口令'} flagSecure={true} />
          {
            error_msg.length > 0 &&
            <ErrorMsg error_msg={error_msg} />
          }

          <ButtonPrimary title={'解锁'} onPress={unlock} />
        </View>
        :
        <LoadingView />
      }
    </View>
  )
}

const ReduxUnlockScreen = connect((state) => {
  return {
    avatar: state.avatar,
    master: state.master
  }
})(UnlockScreen)

export default ReduxUnlockScreen