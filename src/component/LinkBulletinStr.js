import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import tw from 'twrnc'

const LinkBulletinStr = (props) => {
  return (
    <View style={tw.style(`bg-yellow-500 rounded-full px-1 border-2 border-gray-300`)}>
      <Text
        style={tw.style(`text-base text-slate-800 text-center`)}
        onPress={() => props.navigation.push('Bulletin', { hash: props.hash })}>
        {props.str}
      </Text>
    </View>
  )
}

const ReduxLinkBulletinStr = connect((state) => {
  return {
    avatar: state.avatar
  }
})(LinkBulletinStr)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxLinkBulletinStr{...props} navigation={navigation} route={route} />
}