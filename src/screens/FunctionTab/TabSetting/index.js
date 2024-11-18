import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import LinkSetting from '../../../component/LinkSetting'
import SwitchSetting from '../../../component/SwitchSetting'
import ButtonPrimary from '../../../component/ButtonPrimary'
import { MasterConfig } from '../../../lib/OXO'
import { useAppColorScheme } from 'twrnc'
import tw from '../../../lib/tailwind'

//设置Tab
const TabSettingScreen = (props) => {
  const [colorScheme, toggleColorScheme, setColorScheme] = useAppColorScheme(tw)
  const [isDark, setDark] = useState()
  const [isMulti, setMulti] = useState()

  const onSwitchDark = (dark) => {
    if (dark) {
      setColorScheme('dark')
    } else {
      setColorScheme('light')
    }

    setDark(dark)

    MasterConfig({ dark: dark })
      .then(result => {
        if (result) {
          props.dispatch({
            type: actionType.master.setDark,
            dark: dark
          })
        } else {
        }
      })
  }

  const onSwitchMulti = (multi) => {
    // multi:true false
    // address:true address
    let address = true
    if (!multi) {
      address = props.avatar.get('Address')
    }

    setMulti(multi)

    MasterConfig({ multi: address })
      .then(result => {
        if (result) {
          props.dispatch({
            type: actionType.master.setMulti,
            multi: address
          })
        } else {
        }
      })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      let multi = props.master.get("Multi")
      //not setMulti(multi)
      if (multi == true) {
        setMulti(true)
      } else {
        setMulti(false)
      }

      let dark = props.master.get('Dark')
      setDark(dark)
      if (dark == false) {
        setColorScheme('light')
      } else {
        setColorScheme('dark')
      }
    })
  })

  useEffect(() => {
    if (props.avatar.get('AvatarDB') == null) {
      if (props.master.get("Multi") == true) {
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
      <LinkSetting title={'账号设置'} onPress={() => { props.navigation.navigate('SettingMe') }} />
      <View style={tw`h-5`}></View>

      <LinkSetting title={'网络设置'} onPress={() => { props.navigation.navigate('SettingNetwork') }} />
      <LinkSetting title={'地址管理'} onPress={() => { props.navigation.navigate('SettingAddress') }} />
      <LinkSetting title={'公告设置'} onPress={() => { props.navigation.navigate('SettingBulletin') }} />
      <View style={tw`h-5`}></View>

      <SwitchSetting title={'切换暗色主题'} checked={isDark} onChange={onSwitchDark} />
      <SwitchSetting title={'切换多账号模式'} checked={isMulti} onChange={onSwitchMulti} />

      <View style={tw`my-5px px-25px`}>
        {
          isMulti ?
            <ButtonPrimary title='切换账户' bg='bg-indigo-500' onPress={() => { props.dispatch({ type: actionType.avatar.disableAvatar, flag_clear_db: false }) }} />
            :
            <ButtonPrimary title='安全退出' bg='bg-red-500' onPress={() => { props.dispatch({ type: actionType.avatar.disableAvatar, flag_clear_db: false }) }} />
        }
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