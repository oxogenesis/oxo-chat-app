import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { View, Text, ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import Clipboard from '@react-native-clipboard/clipboard'
import AvatarImage from './AvatarImage'
import TextTimestamp from './TextTimestamp'
import LinkMsgInfo from './LinkMsgInfo'
import LinkBulletin from './LinkBulletin'
import tw from '../lib/tailwind'

const ItemMessageFriend = (props) => {
  const msg = props.message
  const copyToClipboard = (content) => {
    Clipboard.setString(content)
    ToastAndroid.show('拷贝成功！',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
  }
  return (
    <View style={tw`flex flex-row`} key={msg.Hash}>
      <View style={tw``}>
        <AvatarImage address={props.friend_address} />
      </View>

      <View style={tw`max-w-64 mt-5px ml-5px`}>
        <Text style={tw`text-left`}>
          <LinkMsgInfo hash={msg.Hash} sequence={msg.Sequence} />
          <TextTimestamp timestamp={msg.Timestamp} textSize={'text-xs'} />
        </Text>

        <View style={tw`flex flex-row`}>
          <Text style={tw`mr-5px mt-2px p-2px ${msg.Confirmed ? 'bg-green-500' : 'bg-neutral-100'} rounded-r-md rounded-bl-md`}>
            {
              msg.IsObject ?
                <LinkBulletin address={msg.ObjectJson.Address} sequence={msg.ObjectJson.Sequence} hash={msg.ObjectJson.Hash} to={props.route.params.address} />
                :
                <Text style={tw`text-base text-left text-stone-800`} onPress={() => { copyToClipboard(msg.Content) }}>
                  {msg.Content}
                </Text>
            }
          </Text>
        </View>
      </View>
    </View>
  )
}

const ReduxItemMessageFriend = connect((state) => {
  return {
    avatar: state.avatar
  }
})(ItemMessageFriend)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxItemMessageFriend{...props} navigation={navigation} route={route} />
}