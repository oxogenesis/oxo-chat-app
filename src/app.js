/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import IconAnt from 'react-native-vector-icons/AntDesign'
import IconFeather from 'react-native-vector-icons/Feather'
//import IconEntypo from 'react-native-vector-icons/Entypo'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import IconFontisto from 'react-native-vector-icons/Fontisto'

import { connect } from 'react-redux'

const Stack = createStackNavigator();

import MasterKeyScreen from './screens/MasterKey'
import UnlockScreen from './screens/Unlock'
import AvatarListScreen from './screens/AvatarList'
import AvatarCreateScreen from './screens/AvatarCreate'
import TabHomeScreen from './screens/TabHome'
import BulletinScreen from './screens/Bulletin'
import BulletinInfoScreen from './screens/BulletinInfo'
import SessionScreen from './screens/Session'
import BulletinListScreen from './screens/BulletinList'
import BulletinPublishScreen from './screens/BulletinPublish'
import AddressMarkScreen from './screens/AddressMark'
import AddressAddScreen from './screens/AddressAdd'
import AddressEditScreen from './screens/AddressEdit'
import SettingMeScreen from './screens/SettingMe'
import SettingNetworkScreen from './screens/SettingNetwork'
import SettingBulletinScreen from './screens/SettingBulletin'
import BulletinMarkScreen from './screens/BulletinMark'
import AvatarNameEditScreen from './screens/AvatarNameEdit'
import AvatarSeedScreen from './screens/AvatarSeed'

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MasterKey">
          <Stack.Screen name="MasterKey" component={MasterKeyScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Unlock" component={UnlockScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TabHome" component={TabHomeScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="AvatarList"
            component={AvatarListScreen}
            options={
              ({ route, navigation }) => ({
                title: "账户列表",
                headerRight: () => (
                  <IconAnt
                    name={'adduser'}
                    size={24}
                    onPress={() => navigation.navigate('AvatarCreate')
                    }
                  />)
              })
            } />
          <Stack.Screen
            name="AvatarCreate"
            component={AvatarCreateScreen}
            options={
              ({ route, navigation }) => ({
                title: "创建账户",
                headerRight: () => (
                  <IconAnt
                    name={'qrcode'}
                    size={24}
                    onPress={() => alert('qrcode')
                    }
                  />)
              })
            } />
          <Stack.Screen
            name="Bulletin"
            component={BulletinScreen}
            options={
              ({ route, navigation }) => ({
                title: "公告",
                headerRight: () => (
                  <IconFontisto
                    name={'info'}
                    size={24}
                    onPress={() => navigation.push('BulletinInfo', { hash: route.params.hash })}
                  />)
              })
            } />
          <Stack.Screen
            name="Session"
            component={SessionScreen}
            options={
              ({ route, navigation }) => ({
                title: "会话",
                headerRight: () => (
                  <IconFeather
                    name={'more-horizontal'}
                    size={24}
                    onPress={() => navigation.push('AddressMark', {
                      AddressMark: route.params.AddressMark
                    })}
                  />)
              })
            } />
          <Stack.Screen
            name="BulletinList"
            component={BulletinListScreen}
            options={
              ({ route, navigation }) => ({
                title: "公告列表",
                headerRight: () => (
                  <IconMaterial
                    name={'post-add'}
                    size={24}
                    onPress={() => navigation.push('BulletinPublish')}
                  />)
              })
            } />
          <Stack.Screen
            name="BulletinPublish"
            component={BulletinPublishScreen}
            options={
              ({ route, navigation }) => ({
                title: "发布公告"
              })
            } />
          <Stack.Screen
            name="AddressMark"
            component={AddressMarkScreen}
            options={
              ({ route, navigation }) => ({
                title: '用户信息'
              })
            } />
          <Stack.Screen
            name="AddressAdd"
            component={AddressAddScreen}
            options={
              ({ route, navigation }) => ({
                title: '标记用户'
              })
            } />
          <Stack.Screen
            name="AddressEdit"
            component={AddressEditScreen}
            options={
              ({ route, navigation }) => ({
                title: '编辑用户标记'
              })
            } />
          <Stack.Screen
            name="BulletinMark"
            component={BulletinMarkScreen}
            options={
              ({ route, navigation }) => ({
                title: '收藏公告'
              })
            } />
          <Stack.Screen
            name="BulletinInfo"
            component={BulletinInfoScreen}
            options={
              ({ route, navigation }) => ({
                title: '公告信息'
              })
            } />
          <Stack.Screen
            name="AvatarNameEdit"
            component={AvatarNameEditScreen}
            options={
              ({ route, navigation }) => ({
                title: '编辑昵称'
              })
            } />
          <Stack.Screen
            name="AvatarSeed"
            component={AvatarSeedScreen}
            options={
              ({ route, navigation }) => ({
                title: '！！！查看种子！！！'
              })
            } />
          <Stack.Screen
            name="SettingMe"
            component={SettingMeScreen}
            options={
              ({ route, navigation }) => ({
                title: '账户设置'
              })
            } />
          <Stack.Screen
            name="SettingNetwork"
            component={SettingNetworkScreen}
            options={
              ({ route, navigation }) => ({
                title: '网络设置'
              })
            } />
          <Stack.Screen
            name="SettingBulletin"
            component={SettingBulletinScreen}
            options={
              ({ route, navigation }) => ({
                title: '公告设置'
              })
            } />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default connect((state) => {
  return {
    master: state.master,
    avatar: state.avatar
  }
})(App);