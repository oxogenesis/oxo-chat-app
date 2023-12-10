import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { TouchableOpacity, View } from 'react-native'
import AvatarImage from './AvatarImage'

const Avatar = (props) => {
  return (
    <View>
      <TouchableOpacity onPress={() => props.navigation.push('AddressMark', { address: props.address })}>
        <AvatarImage address={props.address} />
      </TouchableOpacity>
    </View>
  )
}

const ReduxAvatar = connect((state) => {
  return {
    avatar: state.avatar
  }
})(Avatar)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAvatar{...props} navigation={navigation} route={route} />
}