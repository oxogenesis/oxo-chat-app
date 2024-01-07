import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import { Flex } from '@ant-design/react-native'
import { timestamp_format } from '../lib/Util'
import Avatar from './Avatar'
import LinkBulletin from './LinkBulletin'
import tw from 'twrnc'

const Reply = (props) => {
  return (
    <View>
      <Flex justify="start" align="start" style={tw`border-b-4 border-stone-500`}>
        <View style={tw`mt-5px ml-5px`}>
          <Avatar address={props.address} />
        </View>
        <View style={tw`mt-5px`}>
          <View style={tw`border-b border-stone-500 w-100`}>
            <Text>
              <LinkBulletin address={props.address} sequence={props.sequence} hash={props.hash} to={props.address} />
            </Text>

            <Text style={tw`text-stone-500`}>
              {timestamp_format(props.timestamp)}
            </Text>
          </View>

          <View style={tw`pr-110px`}>
            <Text style={tw`text-base`}>
              {props.content}
            </Text>
          </View>
        </View>
      </Flex>
    </View>
  )
}

const ReduxReply = connect((state) => {
  return {
    avatar: state.avatar
  }
})(Reply)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxReply{...props} navigation={navigation} route={route} />
}