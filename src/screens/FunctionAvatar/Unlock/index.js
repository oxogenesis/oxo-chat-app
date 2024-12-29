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
import { Dirs, FileSystem } from 'react-native-file-access'
import { ConsoleWarn } from '../../../lib/Util'

//解锁界面
const UnlockScreen = (props) => {
  const [master_key, setKey] = useState('')
  const [error_msg, setErrorMsg] = useState('')
  const [flagLoading, setFlagLoading] = useState(false)

  const enableAvatar = (address, name, avatar_list) => {
    mkdir_for_avatar(address)
    setFlagLoading(true)
    let avatar = avatar_list.filter(item => item.Address == address)[0]
    if (avatar) {
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
    } else {
      props.navigation.replace('AvatarCreate')
    }
  }

  const mkdir_for_avatar = async (address) => {
    // tmp bulletin file
    // let file_path = `${Dirs.DocumentDir}/BulletinFile/${address}`
    // result = await FileSystem.exists(file_path)
    // if (!result) {
    //   result = await FileSystem.mkdir(file_path)
    // }

    // tmp chat file
    file_path = `${Dirs.DocumentDir}/TmpChatFile/${address}`
    result = await FileSystem.exists(file_path)
    if (!result) {
      result = await FileSystem.mkdir(file_path)
    }

    // cache file
    file_path = `${Dirs.DocumentDir}/CacheFile/${address}`
    result = await FileSystem.exists(file_path)
    if (!result) {
      result = await FileSystem.mkdir(file_path)
    }
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
          setErrorMsg('')

          let multi = props.master.get('Multi')

          try {
            AsyncStorage.getItem('<#Avatars#>').then(result => {
              if (result != null) {
                if (multi == true) {
                  props.navigation.replace('AvatarList')
                } else {
                  let avatar_list = JSON.parse(result)
                  let address = multi
                  let name = ''
                  for (let i = 0; i < avatar_list.length; i++) {
                    const avatar = avatar_list[i]
                    if (avatar.Address == address) {
                      name = avatar.Name
                    }
                  }
                  enableAvatar(address, name, avatar_list)
                }
              } else {
                props.navigation.replace('AvatarCreate')
              }
            })
          } catch (e) {
            ConsoleWarn(e)
          }
        } else {
          setKey('')
          setErrorMsg('无效口令...')
        }
      })
  }

  const mkdir = async () => {
    let file_path = `${Dirs.DocumentDir}/AvatarImg`
    let result = await FileSystem.exists(file_path)
    if (!result) {
      result = await FileSystem.mkdir(file_path)
    }

    // all files save here
    file_path = `${Dirs.DocumentDir}/File`
    result = await FileSystem.exists(file_path)
    if (!result) {
      result = await FileSystem.mkdir(file_path)
    }
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      props.dispatch({
        type: actionType.master.loadAvatarImage
      })

      if (props.master.get('MasterKey') != null) {
        // 强制安全退出：加载此页面，置空MasterKey
        props.dispatch({
          type: actionType.master.setMasterKey,
          MasterKey: null
        })

      }
      setKey('')
      setErrorMsg('')

      mkdir()
    })
  })

  useEffect(() => {
    if (props.avatar.get('Ready')) {
      props.navigation.replace('TabHome')
    }
  }, [props.avatar])

  const showTutorial = () => {
    props.navigation.push('Tutorial', { key: 'App' })
  }

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
          <ButtonPrimary title={'使用教程'} bg={'bg-yellow-500'} onPress={showTutorial} />
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