import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import tw from '../lib/tailwind'

const LinkName = (props) => {
  return (
    <View style={tw`bg-indigo-500 rounded-full px-1 border-2 border-gray-300 dark:border-gray-700`}>
      <Text
        style={tw`text-base text-slate-800 dark:text-slate-200 text-center`}
        onPress={props.onPress}>
        {`${props.name}`}
      </Text>
    </View>
  )
}

const ReduxLinkName = connect((state) => {
  return {
    avatar: state.avatar
  }
})(LinkName)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxLinkName{...props} navigation={navigation} route={route} />
}