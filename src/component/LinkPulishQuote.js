import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../redux/actions/actionType'
import { Text, View } from 'react-native'
import LinkBulletin from './LinkBulletin'
import tw from '../lib/tailwind'

const LinkPublishQuote = (props) => {
  return (
    <View style={tw`flex-row rounded-lg border-2 border-gray-400`}>
      <LinkBulletin address={props.address} sequence={props.sequence} hash={props.hash} to={props.to} />
      <View style={tw`bg-gray-300 rounded-full px-2`}>
        <Text
          style={tw`text-base text-red-500 text-center`}
          onPress={() => props.dispatch({
            type: actionType.avatar.delQuoteList,
            hash: props.hash
          })}>
          X
        </Text>
      </View>
    </View>
  )
}

const ReduxLinkPublishQuote = connect((state) => {
  return {
    avatar: state.avatar
  }
})(LinkPublishQuote)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxLinkPublishQuote{...props} navigation={navigation} route={route} />
}