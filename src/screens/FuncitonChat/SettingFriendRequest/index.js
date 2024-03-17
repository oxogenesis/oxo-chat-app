import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { AddressToName } from '../../../lib/Util'
import ViewEmpty from '../../../component/ViewEmpty'
import ListAvatar from '../../../component/ListAvatar'
import tw from '../../../lib/tailwind'

//好友申请
const SettingFriendRequestScreen = props => {

  const data = props.avatar.get('FriendRequests')
  const lists = data.map(item => ({
    title: `${AddressToName(props.avatar.get('AddressMap'), item.Address)}`,
    address: item,
    timestamp: item.Timestamp,
    onPress: () => props.navigation.push('AddressMark', { address: item.Address })
  }))

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`h-5`}></View>
      {
        data.length > 0 ?
          <ListAvatar data={lists} />
          :
          <ViewEmpty msg={`暂无好友申请...`} />
      }
    </View >
  )
}

const ReduxSettingFriendRequestScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingFriendRequestScreen)

export default ReduxSettingFriendRequestScreen