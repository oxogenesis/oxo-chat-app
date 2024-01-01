import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import IconAnt from 'react-native-vector-icons/AntDesign'
import { Text, View } from 'react-native'
import tw from 'twrnc'

const TabAddressBookHeader = (props) => {
  // console.log(props)
  return (
    <View style={tw`flex flex-row justify-between`}>
      <View style={tw`basis-1/4`}>
        <IconAnt
          name={'adduser'}
          size={24}
          color={tw.color('blue-500')}
          onPress={() => props.navigation.navigate('AddressAdd')}
        />
      </View>
      <View style={tw`basis-1/2`}>
        <Text style={tw`text-center text-xl`}>
          {props.children}
        </Text>
      </View>
      <View style={tw`basis-3/16`}>
        <Text style={tw`text-center`}>
          { }
        </Text>
      </View>
      <View style={tw`basis-1/16`}>
        <IconAnt
          name={'qrcode'}
          size={24}
          color={tw.color('blue-500')}
          onPress={() => props.navigation.replace('AddressScan')
          }
        />
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