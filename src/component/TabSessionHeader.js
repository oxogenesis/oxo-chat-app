import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import IconAnt from 'react-native-vector-icons/AntDesign'
import { Text, View } from 'react-native'
import tw from 'twrnc'

const TabSessionHeader = (props) => {
  return (
    <View style={tw`w-full flex flex-row justify-between`}>
      <View style={tw``}>
        <Text style={tw`text-center`}>
          { }
        </Text>
      </View>
      <View style={tw``}>
        <Text style={tw`text-center text-xl`}>
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