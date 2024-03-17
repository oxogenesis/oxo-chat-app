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

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      let dark = props.master.get('Dark')
      setDark(dark)
      if (dark == false) {
        setColorScheme('light')
      } else {
        setColorScheme('dark')
      }
    })
  })

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <LinkSetting title={'账号设置'} onPress={() => { props.navigation.navigate('SettingMe') }} />
      <View style={tw`h-5`}></View>
      
      <LinkSetting title={'网络设置'} onPress={() => { props.navigation.navigate('SettingNetwork') }} />
      <LinkSetting title={'地址管理'} onPress={() => { props.navigation.navigate('SettingAddress') }} />
      <LinkSetting title={'公告设置'} onPress={() => { props.navigation.navigate('SettingBulletin') }} />
      <View style={tw`h-5`}></View>
      
      <SwitchSetting title={'切换暗色主题'} checked={isDark} onChange={onSwitchDark} />

      <ButtonPrimary title='关于' onPress={() => { props.navigation.navigate('About') }} />
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