import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import LinkSetting from '../../../component/LinkSetting'
import tw from '../../../lib/tailwind'

//设置
const SettingAddressScreen = props => {
  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`h-5`}></View>
      <LinkSetting title={'好友管理'} onPress={() => { props.navigation.navigate('SettingFriend') }} />
      <LinkSetting title={'好友申请'} onPress={() => { props.navigation.navigate('SettingFriendRequest') }} />
      <LinkSetting title={'关注管理'} onPress={() => { props.navigation.navigate('SettingFollow') }} />
    </View>
  )
}

const ReduxSettingAddressScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingAddressScreen)

export default ReduxSettingAddressScreen