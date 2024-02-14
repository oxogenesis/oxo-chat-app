import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { AddressToName } from '../../../lib/Util'
import { WhiteSpace } from '@ant-design/react-native'
import ViewEmpty from '../../../component/ViewEmpty'
import ListAvatar from '../../../component/ListAvatar'
import tw from '../../../lib/tailwind'

//好友设置
const SettingFriendScreen = (props) => {

  const lists = props.avatar.get('Friends').map(item => ({
    title: `${AddressToName(props.avatar.get('AddressMap'), item)}`,
    address: item,
    onPress: () => props.navigation.push('AddressMark', { address: item })
  }))

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <WhiteSpace size='lg' />
      {
        props.avatar.get('Friends').length > 0 ?
          <ListAvatar data={lists} />
          :
          <ViewEmpty msg={`暂未添加好友...`} />
      }
    </View >
  )
}

const ReduxSettingFriendScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingFriendScreen)

export default ReduxSettingFriendScreen