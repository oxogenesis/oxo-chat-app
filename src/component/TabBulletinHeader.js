import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import IconAnt from 'react-native-vector-icons/AntDesign'
import { Text, View } from 'react-native'
import tw from 'twrnc'

const TabBulletinHeader = (props) => {
  return (
    <View style={tw`w-full flex flex-row justify-between`}>
      <View style={tw``}>
        <IconAnt
          name={'addfile'}
          size={24}
          color={tw.color('yellow-500')}
          onPress={() => props.navigation.navigate('BulletinPublish')}
        />
      </View>
      <View style={tw``}>
        <Text style={tw`text-center text-xl`}>
          {props.children}
        </Text>
      </View>
      <View style={tw``}>
        <View style={tw`absolute right-0`}>
          <IconAnt
            name={'earth'}
            size={24}
            color={tw.color('yellow-500')}
            onPress={() => props.navigation.navigate('BulletinRandom')}
          />
        </View>
      </View>
    </View>
  )
}

const ReduxTabBulletinHeader = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabBulletinHeader)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxTabBulletinHeader{...props} navigation={navigation} route={route} />
}