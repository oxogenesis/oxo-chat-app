import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { Button, WhiteSpace } from '@ant-design/react-native'
import LinkSetting from '../../../component/LinkSetting'
import SwitchSetting from '../../../component/SwitchSetting'
import tw from '../../../lib/tailwind'
import { useAppColorScheme } from 'twrnc'
import ButtonPrimary from '../../../component/ButtonPrimary'

//设置Tab
const TabSettingScreen = (props) => {
  const [colorScheme, toggleColorScheme, setColorScheme] = useAppColorScheme(tw)
  const [isDark, setDark] = useState()

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

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      console.log(colorScheme)
      console.log(colorScheme === 'dark')
      if (colorScheme === 'dark') {
        setDark(true)
      } else {
        setDark(false)
      }
    })
  })

  useEffect(() => {
    if (props.avatar.get('Database') == null) {
      props.navigation.replace('AvatarList')
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

      <View style={tw`my-5px px-25px`}>
        <ButtonPrimary title='切换账户' bg='bg-indigo-500' onPress={() => {
          props.dispatch({
            type: actionType.avatar.disableAvatar,
            flag_clear_db: false
          })
        }} />
        <ButtonPrimary title='关于' onPress={() => { props.navigation.navigate('About') }} />
      </View >
    </View >
  )
}

const ReduxTabSettingScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabSettingScreen)

export default ReduxTabSettingScreen