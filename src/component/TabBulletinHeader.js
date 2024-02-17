import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import IconAnt from 'react-native-vector-icons/AntDesign'
import { Text, View } from 'react-native'
import tw from '../lib/tailwind'

const TabBulletinHeader = (props) => {
  return (
    <View style={tw`w-full flex flex-row justify-between bg-neutral-100 dark:bg-neutral-600 `}>
      <View style={tw``}>
        <IconAnt
          name={'addfile'}
          size={24}
          color={tw.color('yellow-500')}
          onPress={() => props.navigation.navigate('BulletinPublish')}
        />
      </View>
      <View style={tw``}>
        <Text style={tw`text-center text-2xl text-slate-800 dark:text-slate-200`}>
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