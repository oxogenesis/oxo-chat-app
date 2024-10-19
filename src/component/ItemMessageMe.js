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

const ItemMessageMe = (props) => {
  const msg = props.message
  const copyToClipboard = (content) => {
    Clipboard.setString(content)
    ToastAndroid.show('拷贝成功！',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
  }
  return (
    <View style={tw`flex flex-row-reverse`} key={msg.Hash}>
      <View>
        <AvatarImage address={props.self_address} />
      </View>

      <View style={tw`ml-50px max-w-64 mt-5px`}>
        <Text style={tw`text-right mr-5px`}>
          <LinkMsgInfo hash={msg.Hash} sequence={msg.Sequence} />
          <TextTimestamp timestamp={msg.Timestamp} textSize={'text-xs'} />
        </Text>

        <View style={tw`flex flex-row-reverse`}>
          <Text style={tw`mr-5px mt-2px p-2px ${msg.Confirmed ? 'bg-green-500' : 'bg-neutral-100'} rounded-l-md rounded-br-md`}>
            {
              msg.IsObject ?
                <View style={tw``}>
                  <LinkBulletin address={msg.ObjectJson.Address} sequence={msg.ObjectJson.Sequence} hash={msg.ObjectJson.Hash} to={props.route.params.address} />
                </View>
                :
                <Text style={tw`text-base text-right text-stone-900`} onPress={() => { copyToClipboard(msg.Content) }}>
                  {msg.Content}
                </Text>
            }
          </Text>
        </View>
      </View>
    </View>
  )
}

const ReduxItemMessageMe = connect((state) => {
  return {
    avatar: state.avatar
  }
})(ItemMessageMe)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxItemMessageMe{...props} navigation={navigation} route={route} />
}