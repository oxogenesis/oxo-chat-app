import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import IconAnt from 'react-native-vector-icons/AntDesign'
import { Text, View } from 'react-native'
import tw from 'twrnc'

const TabBulletinHeader = (props) => {
  return (
    <View style={tw`flex flex-row justify-between`}>
      <View style={tw`basis-1/4`}>
        <IconAnt
          name={'addfile'}
          size={24}
          color={tw.color('yellow-500')}
          onPress={() => props.navigation.navigate('BulletinPublish')}
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
          name={'earth'}
          size={24}
          color={tw.color('yellow-500')}
          onPress={() => props.navigation.navigate('BulletinRandom')}
        />
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