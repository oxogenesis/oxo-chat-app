import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { AddressToName } from '../../../lib/Util'
import ViewEmpty from '../../../component/ViewEmpty'
import ListAvatar from '../../../component/ListAvatar'
import tw from '../../../lib/tailwind'

//关注设置
const SettingFollowScreen = props => {

  const lists = props.avatar.get('Follows').map(item => ({
    title: `${AddressToName(props.avatar.get('AddressMap'), item)}`,
    address: item,
    onPress: () => props.navigation.push('AddressMark', { address: item })
  }))

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`h-5`}></View>
      {
        props.avatar.get('Follows').length > 0 ?
          <ListAvatar data={lists} />
          :
          <ViewEmpty msg={`暂无关注账号...`} />
      }
    </View >
  )
}

const ReduxSettingFollowScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingFollowScreen)

export default ReduxSettingFollowScreen