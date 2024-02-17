import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import tw from '../lib/tailwind'

const TabSessionHeader = (props) => {
  return (
    <View style={tw`w-full flex flex-row justify-between bg-neutral-100 dark:bg-neutral-600 `}>
      <View style={tw``}>
        <Text style={tw`text-center`}>
          { }
        </Text>
      </View>
      <View style={tw``}>
        <Text style={tw`text-center text-2xl text-slate-800 dark:text-slate-200`}>
          {props.children}
        </Text>
      </View>
      <View style={tw``}>
        <View style={tw`absolute right-0`}>
          <Text style={tw`text-center`}>
            { }
          </Text>
        </View>
      </View>
    </View>
  )
}

const ReduxTabSessionHeader = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabSessionHeader)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxTabSessionHeader{...props} navigation={navigation} route={route} />
}