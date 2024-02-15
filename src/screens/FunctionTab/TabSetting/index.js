import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { WhiteSpace } from '@ant-design/react-native'
import LinkSetting from '../../../component/LinkSetting'
import SwitchSetting from '../../../component/SwitchSetting'
import ButtonPrimary from '../../../component/ButtonPrimary'
import { useAppColorScheme } from 'twrnc'
import { AvatarSingleton } from '../../../lib/OXO'
import tw from '../../../lib/tailwind'

//设置Tab
const TabSettingScreen = (props) => {
  const [colorScheme, toggleColorScheme, setColorScheme] = useAppColorScheme(tw)
  const [isDark, setDark] = useState()
  const [isSingleton, setSingleton] = useState()

  const onSwitchChange = (value) => {
    // toggleColorScheme
    if (value) {
      setColorScheme('dark')
      setDark(true)
    } else {
      setColorScheme('light')
      setDark(false)
    }
  }

  const onSwitchSingleton = (value) => {
    let address = props.avatar.get('Address')
    if (value) {
      setSingleton(true)
    } else {
      setSingleton(false)
      address = false
    }
    AvatarSingleton(address)
      .then(result => {
        if (result) {
          props.dispatch({
            type: actionType.master.setSingleton,
            singleton: address
          })
        } else {
        }
      })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      console.log(colorScheme)
      console.log(colorScheme === 'dark')
      if (colorScheme === 'dark') {
        setDark(true)
      } else {
        setDark(false)
      }

      let singleton = props.master.get('Singleton')
      if (singleton == false) {
        setSingleton(false)
      } else {
        setSingleton(true)
      }
    })
  })

  useEffect(() => {
    if (props.avatar.get('Database') == null) {
      if (props.master.get("Singleton") == false) {
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'AvatarList' }],
        })
      } else {
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'Unlock' }],
        })
      }
    }
  }, [props.avatar])

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <WhiteSpace size='lg' />
      <LinkSetting title={'账号设置'} onPress={() => { props.navigation.navigate('SettingMe') }} />
      <WhiteSpace size='lg' />
      <LinkSetting title={'网络设置'} onPress={() => { props.navigation.navigate('SettingNetwork') }} />
      <LinkSetting title={'地址管理'} onPress={() => { props.navigation.navigate('SettingAddress') }} />
      <LinkSetting title={'公告设置'} onPress={() => { props.navigation.navigate('SettingBulletin') }} />
      <WhiteSpace size='lg' />

      <SwitchSetting title={'切换主题'} checked={isDark} onChange={onSwitchChange} />
      <SwitchSetting title={'切换单账号模式'} checked={isSingleton} onChange={onSwitchSingleton} />


      <View style={tw`my-5px px-25px`}>
        {
          isSingleton ?
            <ButtonPrimary title='安全退出' bg='bg-red-500' onPress={() => { props.dispatch({ type: actionType.avatar.disableAvatar, flag_clear_db: false }) }} />
            :
            <ButtonPrimary title='切换账户' bg='bg-indigo-500' onPress={() => { props.dispatch({ type: actionType.avatar.disableAvatar, flag_clear_db: false }) }} />
        }
        <ButtonPrimary title='关于' onPress={() => { props.navigation.navigate('About') }} />
      </View >
    </View >
  )
}

const ReduxTabSettingScreen = connect((state) => {
  return {
    avatar: state.avatar,
    master: state.master
  }
})(TabSettingScreen)

export default ReduxTabSettingScreen