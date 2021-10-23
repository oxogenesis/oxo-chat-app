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


import MasterKeyScreen from './screens/MasterKey'
import UnlockScreen from './screens/Unlock'
import AvatarListScreen from './screens/AvatarList'
import AvatarCreateScreen from './screens/AvatarCreate'
import AvatarNameEditScreen from './screens/AvatarNameEdit'
import AvatarSeedScreen from './screens/AvatarSeed'
import AvatarSeedQrcodeScreen from './screens/AvatarSeedQrcode'
import AvatarCreateFromScanSeedQrcodeScreen from './screens/AvatarCreateFromScanSeedQrcode'
import TabHomeScreen from './screens/TabHome'
import BulletinScreen from './screens/Bulletin'
import BulletinInfoScreen from './screens/BulletinInfo'
import SessionScreen from './screens/Session'
import BulletinListScreen from './screens/BulletinList'
import BulletinPublishScreen from './screens/BulletinPublish'
import AddressMarkScreen from './screens/AddressMark'
import AddressAddScreen from './screens/AddressAdd'
import AddressAddFromQrcodeScreen from './screens/AddressAddFromQrcode'
import AddressEditScreen from './screens/AddressEdit'
import AddressSelectScreen from './screens/AddressSelect'
import AddressScanScreen from './screens/AddressScan'
import SettingMeScreen from './screens/SettingMe'
import SettingNetworkScreen from './screens/SettingNetwork'
import SettingBulletinScreen from './screens/SettingBulletin'
import SettingAddressScreen from './screens/SettingAddress'
import SettingFriendScreen from './screens/SettingFriend'
import SettingFollowScreen from './screens/SettingFollow'
import SettingFriendRequestScreen from './screens/SettingFriendRequest'
import BulletinCacheScreen from './screens/BulletinCache'

const Stack = createStackNavigator()

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
                headerLeft: false,
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
                    onPress={() => navigation.navigate('AvatarCreateFromScanSeedQrcode')
                    }
                  />)
              })
            } />
          <Stack.Screen
            name="AvatarCreateFromScanSeedQrcode"
            component={AvatarCreateFromScanSeedQrcodeScreen}
            options={
              ({ route, navigation }) => ({
                title: '种子扫描'
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
                      address: route.params.address
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
                    onPress={() => navigation.navigate('BulletinPublish')}
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
                title: '标记地址'
              })
            } />
          <Stack.Screen
            name="AddressAddFromQrcode"
            component={AddressAddFromQrcodeScreen}
            options={
              ({ route, navigation }) => ({
                title: '扫描二维码标记地址'
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
            name="AddressSelect"
            component={AddressSelectScreen}
            options={
              ({ route, navigation }) => ({
                title: '选择好友'
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
            name="AvatarSeedQrcode"
            component={AvatarSeedQrcodeScreen}
            options={
              ({ route, navigation }) => ({
                title: '！！！种子二维码！！！'
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
          <Stack.Screen
            name="BulletinCache"
            component={BulletinCacheScreen}
            options={
              ({ route, navigation }) => ({
                title: '公告缓存设置'
              })
            } />
          <Stack.Screen
            name="SettingAddress"
            component={SettingAddressScreen}
            options={
              ({ route, navigation }) => ({
                title: '地址设置'
              })
            } />
          <Stack.Screen
            name="SettingFriend"
            component={SettingFriendScreen}
            options={
              ({ route, navigation }) => ({
                title: '好友设置'
              })
            } />
          <Stack.Screen
            name="SettingFollow"
            component={SettingFollowScreen}
            options={
              ({ route, navigation }) => ({
                title: '关注设置'
              })
            } />
          <Stack.Screen
            name="SettingFriendRequest"
            component={SettingFriendRequestScreen}
            options={
              ({ route, navigation }) => ({
                title: '好友申请设置'
              })
            } />
          <Stack.Screen
            name="AddressScan"
            component={AddressScanScreen}
            options={
              ({ route, navigation }) => ({
                title: '地址扫描'
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
})(App)