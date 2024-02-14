import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import IconAnt from 'react-native-vector-icons/AntDesign'
import { Text, View } from 'react-native'
import tw from '../lib/tailwind'

const TabAddressBookHeader = (props) => {
  // console.log(props)
  return (
    <View style={tw`w-full flex flex-row justify-between`}>
      <View style={tw``}>
        <IconAnt
          name={'adduser'}
          size={24}
          color={tw.color('indigo-500')}
          onPress={() => props.navigation.navigate('AddressAdd')}
        />
      </View>
      <View style={tw``}>
        <Text style={tw`text-center text-2xl`}>
          {props.children}
        </Text>
      </View>
      <View style={tw``}>
        <View style={tw`absolute right-0`}>
          <IconAnt
            name={'qrcode'}
            size={24}
            color={tw.color('indigo-500')}
            onPress={() => props.navigation.navigate('AddressScan')
            }
          />
        </View>
      </View>
    </View>
  )
}

const ReduxTabAddressBookHeader = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabAddressBookHeader)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxTabAddressBookHeader{...props} navigation={navigation} route={route} />
}