import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { actionType } from '../../../redux/actions/actionType'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MasterKeySet } from '../../../lib/OXO'
import { DefaultHost, DefaultTheme, DefaultBulletinCacheSize } from '../../../lib/Const'
import { connect } from 'react-redux'
import ButtonPrimary from '../../../component/ButtonPrimary'
import InputPrimary from '../../../component/InputPrimary'
import ErrorMsg from '../../../component/ErrorMsg'
import tw from '../../../lib/tailwind'

//口令设置界面
const MasterKeyScreen = props => {
  const [masterKey, setMasterKey] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error_msg, setMsg] = useState('')

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      let timestamp = Date.now()
      try {
        // 所有账号使用全局设置：主题、服务器地址
        // 设置服务器地址
        AsyncStorage.getItem('HostList').then(json => {
          let host_list = []
          if (json != null) {
            let HostList = JSON.parse(json)
            HostList.forEach(item => {
              host_list.push({ Address: item.Address, UpdatedAt: item.UpdatedAt })
            })
          }
          if (host_list.length == 0) {
            host_list.push({ Address: DefaultHost, UpdatedAt: timestamp })
          }
          props.dispatch({
            type: actionType.avatar.changeHostList,
            host_list: host_list
          })
          let current_host = host_list[0].Address
          props.dispatch({
            type: actionType.avatar.setCurrentHost,
            current_host: current_host,
            current_host_timestamp: timestamp
          })
        })

        // 设置主题
        AsyncStorage.getItem('Theme').then(json => {
          let theme = DefaultTheme
          if (json != null) {
            json = JSON.parse(json)
            if (json.Theme != null && json.Theme == 'dark') {
              theme = 'dark'
            }
          }
          props.dispatch({
            type: actionType.avatar.changeTheme,
            theme: theme
          })
        })

        // 设置公告缓存大小
        AsyncStorage.getItem('BulletinCacheSize').then(bulletin_cache_size => {
          if (bulletin_cache_size == null || isNaN(bulletin_cache_size) || bulletin_cache_size < 0) {
            bulletin_cache_size = DefaultBulletinCacheSize
          }
          props.dispatch({
            type: actionType.avatar.changeBulletinCacheSize,
            bulletin_cache_size: bulletin_cache_size
          })
        })

        AsyncStorage.getItem('<#MasterKey#>').then(result => {
          if (result != null) {
            props.navigation.replace('Unlock')
          }
        })
      } catch (e) {
        console.log(e)
      }
    })
  })

  const saveMasterKey = () => {
    if (masterKey != confirm) {
      setMsg('口令确认不符...')
      return
    } else if (masterKey.trim() == '') {
      setMsg('口令不能为空...')
      return
    }

    MasterKeySet(masterKey).then(result => {
      if (result) {
        setMasterKey('')
        setConfirm('')
        props.navigation.replace('Unlock')
      }
    })
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`my-auto p-25px`}>
        <InputPrimary value={masterKey} setValue={setMasterKey} placeholder={'口令'} flagSecure={true} />
        <InputPrimary value={confirm} setValue={setConfirm} placeholder={'口令确认'} flagSecure={true} />
        
        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }
        
        <ButtonPrimary title={'设置'} onPress={saveMasterKey} />

        <Text style={tw`text-base text-red-500`}>
          {`说明：
1、口令用于在本设备上加密/解密账户的种子。
2、账户的种子是账户的唯一凭证，不可泄漏、灭失，应做好备份。
3、本地存储的聊天和公告，未进行加密，如需销毁，请删除应用或相关数据。`}
        </Text>
      </View>
    </View>
  )
}

const ReduxMasterKeyScreen = connect((state) => {
  return {
    avatar: state.avatar,
    master: state.master
  }
})(MasterKeyScreen)

export default ReduxMasterKeyScreen