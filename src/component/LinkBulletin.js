import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import { AddressToName } from '../lib/Util'
import tw from '../lib/tailwind'

const LinkBulletin = (props) => {
  let name = AddressToName(props.avatar.get('AddressMap'), props.address)
  let display = props.display
  if (!props.display) {
    display = `${name}#${props.sequence}`
  }
  return (
    <View style={tw`bg-yellow-500 rounded-full px-1 border-2 border-gray-300 dark:border-gray-700`}>
      <Text
        style={tw`text-base text-slate-800 dark:text-slate-200 text-center`}
        onPress={() => props.navigation.push('Bulletin', {
          address: props.address,
          sequence: props.sequence,
          hash: props.hash,
          to: props.to
        })}>
        {display}
      </Text>
    </View>
  )
}

const ReduxLinkBulletin = connect((state) => {
  return {
    avatar: state.avatar
  }
})(LinkBulletin)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxLinkBulletin{...props} navigation={navigation} route={route} />
}