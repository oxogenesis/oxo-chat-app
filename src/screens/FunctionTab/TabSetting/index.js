import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { WhiteSpace } from '@ant-design/react-native'
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
  const [isSingleton, setSingleton] = useState()

  const onSwitchChange = (dark) => {
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

  const onSwitchSingleton = (singleton) => {
    // singleton:true false
    // address:false address
    let address = false
    if (singleton) {
      address = props.avatar.get('Address')
    }

    setSingleton(singleton)
    
    MasterConfig({ singleton: address })
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
      let dark = props.master.get('Dark')
      setDark(dark)
      if (dark == false) {
        setColorScheme('light')
      } else {
        setColorScheme('dark')
      }

      let singleton = props.master.get('Singleton')
      //not setSingleton(singleton)
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

      <SwitchSetting title={'切换暗色主题'} checked={isDark} onChange={onSwitchChange} />
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