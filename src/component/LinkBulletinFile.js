import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { actionType } from '../redux/actions/actionType'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import TextFileSize from './TextFileSize'
import tw from '../lib/tailwind'

const LinkBulletinFile = (props) => {
  return (
    <View style={tw`bg-blue-500 rounded-full px-1 border-2 border-gray-300 dark:border-gray-700 text-slate-800 dark:text-slate-200`}>
      <Text style={tw`text-base align-middle text-center`}
        onPress={() => {
          props.dispatch({
            type: actionType.avatar.LoadCurrentBulletinFile,
            address: props.address,
            hash: props.hash,
            name: props.name,
            ext: props.ext
          })
          props.navigation.push('FileView', {
            address: props.address,
            hash: props.hash
          })
        }}>
        <View style={tw`my-auto rounded-full px-1`}>
          <Text>
            {`${props.name}.${props.ext}`}
          </Text>
        </View>

        <TextFileSize size={props.size} />
      </Text>
    </View >
  )
}

const ReduxLinkBulletinFile = connect((state) => {
  return {
    avatar: state.avatar
  }
})(LinkBulletinFile)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxLinkBulletinFile{...props} navigation={navigation} route={route} />
}