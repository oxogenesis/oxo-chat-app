import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { Text, View, TouchableOpacity } from 'react-native'
import TextFileSize from './TextFileSize'
import tw from '../lib/tailwind'

const LinkPublishFile = (props) => {
  return (
    <TouchableOpacity style={tw`flex-row rounded-lg border-2 border-gray-400`} onPress={props.onPress}>
      <View style={tw`bg-blue-500 rounded-full px-1 border-2 border-gray-300 dark:border-gray-700 text-slate-800 dark:text-slate-200`}>
        <Text style={tw`text-base align-middle text-center`}>
          <View style={tw`my-auto rounded-full px-1`}>
            <Text>
              {`${props.name}.${props.ext}`}
            </Text>
          </View>

          <TextFileSize size={props.size} />
        </Text>
      </View>
      <View style={tw`bg-gray-300 rounded-full px-2`}>
        <Text style={tw`text-base text-red-500 text-center`}>
          X
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const ReduxLinkPublishFile = connect((state) => {
  return {
    avatar: state.avatar
  }
})(LinkPublishFile)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxLinkPublishFile{...props} navigation={navigation} route={route} />
}