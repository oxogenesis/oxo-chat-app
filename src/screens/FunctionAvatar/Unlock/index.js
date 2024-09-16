import React, { useState, useEffect } from 'react'
import { View, PermissionsAndroid } from 'react-native'
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
    let file_path = `${Dirs.DocumentDir}/BulletinFile/${address}`
    result = await FileSystem.exists(file_path)
    if (!result) {
      result = await FileSystem.mkdir(file_path)
    }

    file_path = `${Dirs.DocumentDir}/ChatFile/${address}`
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
                    const avatar = avatar_list[i];
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
            console.log(e)
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

    file_path = `${Dirs.DocumentDir}/BulletinFile`
    result = await FileSystem.exists(file_path)
    if (!result) {
      result = await FileSystem.mkdir(file_path)
    }

    file_path = `${Dirs.DocumentDir}/ChatFile`
    result = await FileSystem.exists(file_path)
    if (!result) {
      result = await FileSystem.mkdir(file_path)
    }

    // TEST
    // result = await FileSystem.stat(`${Dirs.SDCardDir}/Download/wjj.txt`)
    // console.log(result)
    // result = await FileSystem.readFile(`${Dirs.SDCardDir}/Download/wjj.txt`, 'utf8')
    // console.log(result)
    // file_path = `${Dirs.DocumentDir}/BulletinFile/o5u16bM76fMkX9tAiUPuruKWxEub6YPLkx`
    // result = await FileSystem.ls(file_path)
    // console.log(result)
    // result = await FileSystem.readFile(`${Dirs.DocumentDir}/BulletinFile/o5u16bM76fMkX9tAiUPuruKWxEub6YPLkx/1DA19E891780AFD8755E7100D70870A8890874DC`, 'utf8')
    // console.log(result)
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
      setErrorMsg('')

      mkdir()
    })
  })

  useEffect(() => {
    if (props.avatar.get('Database') != null) {
      props.navigation.replace('TabHome')
    }
  }, [props.avatar])

  // const permission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //       {
  //         title: "Cool Photo App Camera Permission",
  //         message:
  //           "Your app needs permission.",
  //         buttonNeutral: "Ask Me Later",
  //         buttonNegative: "Cancel",
  //         buttonPositive: "OK"
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       return true;
  //     } else {
  //       console.log("Camera permission denied");
  //       return false;
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //     return false;
  //   }
  // }

  // const webview = async () => {
  //   console.log(`webview------------------------------webview`)
  //   let hasPermission = await permission()
  //   console.log(`hasPermission------------------------------${hasPermission}`)
  //   if (hasPermission) {
  //     console.log(`${Dirs.DocumentDir}`)
  //     console.log(`${Dirs.DatabaseDir}`)
  //     console.log(`${Dirs.CacheDir}`)
  //     console.log(`${Dirs.MainBundleDir}`)
  //     console.log(`${Dirs.SDCardDir}`)
  //     props.navigation.push('Webview', { uri: `/storage/emulated/0/Download/a.xls` })
  //     let result
  //     let avatar_img_path = `${Dirs.DocumentDir}/AvatarImg/obK8US8RELir5YF2Vc7jAxPQZx9HsxoYTq`
  //     result = await FileSystem.exists(avatar_img_path)
  //     result = await FileSystem.writeFile(`/storage/emulated/0/Download/111.pdf`, `data`, 'utf8')
  //     result = await FileSystem.stat('/storage/emulated/0/Download/111.txt')
  //     console.log(result)
  //     result = await FileSystem.readFile('/storage/emulated/0/Download/111.txt', 'utf8')
  //     console.log(result)

  //     result = await FileSystem.stat(`${Dirs.SDCardDir}/Download/wjj.txt`)
  //     console.log(result)
  //     result = await FileSystem.readFile(`${Dirs.SDCardDir}/Download/wjj.txt`, 'utf8')
  //     console.log(result)

  //     result = FileSystem.cp(`/storage/emulated/0/Download/a.xls`, `/data/user/0/oxo.chat/files/AvatarImg/a.xls`)
  //     result = FileSystem.cp(`/storage/emulated/0/Download/gd.pdf`, `/data/user/0/oxo.chat/files/AvatarImg/gd.pdf`)
  //     result = FileSystem.cp(`/storage/emulated/0/Download/next-log.txt`, `/data/user/0/oxo.chat/files/AvatarImg/next-log.txt`)
  //     result = await FileSystem.exists(`/data/user/0/oxo.chat/files/AvatarImg/a.xls`)
  //     result = await FileSystem.exists(`/data/user/0/oxo.chat/files/AvatarImg/gd.pdf`)
  //     result = await FileSystem.exists(`/data/user/0/oxo.chat/files/AvatarImg/next-log.txt`)
  //     result = await FileSystem.ls(`/data/user/0/oxo.chat/files/AvatarImg/`)
  //     console.log(result)
  //     result = await FileSystem.ls(`/storage/emulated/0/Download/`)
  //     console.log(result)
  //     if (result) {
  //       props.navigation.push('Webview', { uri: avatar_img_path })
  //     }
  //   } else {
  //     console.log(`no permisson`)
  //   }
  // }


  // <ButtonPrimary title={'webview'} onPress={webview} />
  // <ButtonPrimary title={'View'} onPress={() => props.navigation.push('FileExplorer', { dir: Dirs.SDCardDir })} />

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