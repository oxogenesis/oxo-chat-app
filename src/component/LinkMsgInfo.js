import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import tw from '../lib/tailwind'


const LinkMsgInfo = (props) => {
  return (
    <View style={tw`rounded-full px-1 border border-gray-400 bg-green-400`}>
      <Text style={tw`text-xs text-gray-400 text-center`} onPress={() => props.navigation.push('MsgInfo', { hash: props.hash })}>
        {`#${props.sequence}`}
      </Text>
    </View>
  )
}

const ReduxLinkMsgInfo = connect((state) => {
  return {
    avatar: state.avatar
  }
})(LinkMsgInfo)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxLinkMsgInfo{...props} navigation={navigation} route={route} />
}