import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { connect } from 'react-redux'

import IconAnt from 'react-native-vector-icons/AntDesign'
import IconFeather from 'react-native-vector-icons/Feather'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import IconEntypo from 'react-native-vector-icons/Entypo'
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons'

// Avatar
import MasterKeyScreen from '../FunctionAvatar/MasterKey'
import UnlockScreen from '../FunctionAvatar/Unlock'
import AvatarListScreen from '../FunctionAvatar/AvatarList'
import AvatarCreateScreen from '../FunctionAvatar/AvatarCreate'
import AvatarCreateFromScanSeedQrcodeScreen from '../FunctionAvatar/AvatarCreateFromScanSeedQrcode'
import AvatarNameEditScreen from '../FunctionAvatar/AvatarNameEdit'
import AvatarSeedScreen from '../FunctionAvatar/AvatarSeed'
import AvatarSeedQrcodeScreen from '../FunctionAvatar/AvatarSeedQrcode'
import SettingMeScreen from '../FunctionAvatar/SettingMe'

// Contact
import AddressMarkScreen from '../FunctionContact/AddressMark'
import AddressAddScreen from '../FunctionContact/AddressAdd'
import AddressAddFromQrcodeScreen from '../FunctionContact/AddressAddFromQrcode'
import AddressEditScreen from '../FunctionContact/AddressEdit'
import AddressScanScreen from '../FunctionContact/AddressScan'
import SettingAddressScreen from '../FunctionContact/SettingAddress'

// Bulletin
import BulletinScreen from '../FunctionBulletin/Bulletin'
import BulletinRandomScreen from '../FunctionBulletin/BulletinRandom'
import BulletinInfoScreen from '../FunctionBulletin/BulletinInfo'
import BulletinListScreen from '../FunctionBulletin/BulletinList'
import BulletinPublishScreen from '../FunctionBulletin/BulletinPublish'
import BulletinCacheScreen from '../FunctionBulletin/BulletinCache'
import BulletinAddressListScreen from '../FunctionBulletin/BulletinAddressList'
import BulletinReplyListScreen from '../FunctionBulletin/BulletinReplyList'
import SettingBulletinScreen from '../FunctionBulletin/SettingBulletin'
import SettingFollowScreen from '../FunctionBulletin/SettingFollow'

// Chat
import SessionScreen from '../FuncitonChat/Session'
import MsgInfoScreen from '../FuncitonChat/MsgInfo'
import SettingFriendScreen from '../FuncitonChat/SettingFriend'
import SettingFriendRequestScreen from '../FuncitonChat/SettingFriendRequest'

//tab network about etc...
import TabHomeScreen from '../FunctionTab/TabHome'
import SettingNetworkScreen from '../FunctionTab/SettingNetwork'
import ServerAddScreen from '../FunctionTab/ServerAdd'
import AboutScreen from '../FunctionTab/About'
import AddressSelectScreen from '../FunctionTab/AddressSelect'
import tw from '../../lib/tailwind'

import { AddressToName } from '../../lib/Util'

const Stack = createStackNavigator()

const AppStack = (props) => {

  const headerStyleOption = {
    headerStyle: {
      backgroundColor: tw.color(`neutral-200`),
    },
    headerTitleStyle: {
      color: tw.color(`neutral-800`),
    },
    headerTintColor: tw.color(`neutral-800`)
  }

  return (
    <Stack.Navigator initialRouteName="MasterKey">
      {/* main */}
      <Stack.Screen
        name="MasterKey"
        component={MasterKeyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Unlock"
        component={UnlockScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TabHome"
        component={TabHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AvatarList"
        component={AvatarListScreen}
        options={
          ({ route, navigation }) => ({
            title: "账户列表",
            headerLeft: false,
            ...headerStyleOption,
            headerRight: () => (
              <IconAnt
                name={'adduser'}
                size={32}
                color={tw.color(`neutral-800`)}
                onPress={() => navigation.navigate('AvatarCreate')
                }
              />)
          })
        }
      />
      <Stack.Screen
        name="AvatarCreate"
        component={AvatarCreateScreen}
        options={
          ({ route, navigation }) => ({
            title: "创建账户",
            ...headerStyleOption,
            headerRight: () => (
              <IconAnt
                name={'qrcode'}
                size={32}
                color={tw.color(`neutral-800`)}
                onPress={() => navigation.replace('AvatarCreateFromScanSeedQrcode')
                }
              />)
          })
        }
      />
      <Stack.Screen
        name="AvatarCreateFromScanSeedQrcode"
        component={AvatarCreateFromScanSeedQrcodeScreen}
        options={
          ({ route, navigation }) => ({
            title: '扫描种子创建账户',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="AvatarNameEdit"
        component={AvatarNameEditScreen}
        options={
          ({ route, navigation }) => ({
            title: '编辑昵称',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="AvatarSeed"
        component={AvatarSeedScreen}
        options={
          ({ route, navigation }) => ({
            title: '！！！查看种子！！！',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="AvatarSeedQrcode"
        component={AvatarSeedQrcodeScreen}
        options={
          ({ route, navigation }) => ({
            title: '！！！种子二维码！！！',
            ...headerStyleOption,
          })
        }
      />
      {/* bulletin */}
      <Stack.Screen
        name="Bulletin"
        component={BulletinScreen}
        options={
          ({ route, navigation }) => ({
            title: "公告",
            ...headerStyleOption,
            headerRight: () => (
              <IconAnt
                name={'earth'}
                size={32}
                color={tw.color(`neutral-800`)}
                onPress={() => navigation.push('BulletinReplyList', { hash: route.params.hash, page: 1 })}
              />)
          })
        }
      />
      <Stack.Screen
        name="BulletinRandom"
        component={BulletinRandomScreen}
        options={
          ({ route, navigation, props }) => ({
            title: "公告：随便看看",
            ...headerStyleOption
          })
        }
      />
      <Stack.Screen
        name="BulletinList"
        component={BulletinListScreen}
        options={
          ({ route, navigation }) => ({
            title: `公告列表:${AddressToName(props.avatar.get('AddressMap'), route.params.address)}`,
            ...headerStyleOption,
            headerRight: () => (
              <IconMaterial
                name={'post-add'}
                size={32}
                color={tw.color(`neutral-800`)}
                onPress={() => navigation.navigate('BulletinPublish')}
              />)
          })
        }
      />
      <Stack.Screen
        name="BulletinPublish"
        component={BulletinPublishScreen}
        options={
          ({ route, navigation }) => ({
            title: "发布公告",
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="BulletinInfo"
        component={BulletinInfoScreen}
        options={
          ({ route, navigation }) => ({
            title: '公告信息',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="BulletinAddressList"
        component={BulletinAddressListScreen}
        options={
          ({ route, navigation }) => ({
            title: '活跃用户',
            ...headerStyleOption,
            headerRight: () => (
              <IconEntypo
                name={'arrow-with-circle-right'}
                size={32}
                color={tw.color(`neutral-800`)}
                onPress={() => navigation.push('BulletinAddressList', { page: route.params.page + 1 })}
              />)
          })
        }
      />
      <Stack.Screen
        name="BulletinReplyList"
        component={BulletinReplyListScreen}
        options={
          ({ route, navigation }) => ({
            title: '网络评论',
            ...headerStyleOption,
            headerRight: () => (
              <IconEntypo
                name={'arrow-with-circle-right'}
                size={32}
                color={tw.color(`neutral-800`)}
                onPress={() => navigation.push('BulletinReplyList', { page: route.params.page + 1 })}
              />)
          })
        }
      />
      {/* chat */}
      <Stack.Screen
        name="Session"
        component={SessionScreen}
        options={
          ({ route, navigation }) => ({
            title: "会话",
            ...headerStyleOption,
            headerRight: () => (
              <IconFeather
                name={'more-horizontal'}
                size={32}
                color={tw.color(`neutral-800`)}
                onPress={() => navigation.push('AddressMark', {
                  address: route.params.address
                })}
              />)
          })
        }
      />
      <Stack.Screen
        name="MsgInfo"
        component={MsgInfoScreen}
        options={
          ({ route, navigation }) => ({
            title: "消息信息",
            ...headerStyleOption,
          })
        }
      />
      {/* contact */}
      <Stack.Screen
        name="AddressMark"
        component={AddressMarkScreen}
        options={
          ({ route, navigation }) => ({
            title: '用户信息',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="AddressAdd"
        component={AddressAddScreen}
        options={
          ({ route, navigation }) => ({
            title: '标记地址',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="AddressAddFromQrcode"
        component={AddressAddFromQrcodeScreen}
        options={
          ({ route, navigation }) => ({
            title: '扫描二维码标记地址',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="AddressEdit"
        component={AddressEditScreen}
        options={
          ({ route, navigation }) => ({
            title: '编辑用户标记',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="AddressSelect"
        component={AddressSelectScreen}
        options={
          ({ route, navigation }) => ({
            title: '选择好友',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="AddressScan"
        component={AddressScanScreen}
        options={
          ({ route, navigation }) => ({
            title: '地址扫描',
            ...headerStyleOption,
          })
        }
      />
      {/* setting */}
      <Stack.Screen
        name="SettingMe"
        component={SettingMeScreen}
        headerBackTitle='返回'
        options={
          ({ route, navigation }) => ({
            title: '账户设置',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="SettingNetwork"
        component={SettingNetworkScreen}
        options={
          ({ route, navigation }) => ({
            title: '网络设置',
            ...headerStyleOption,
            headerRight: () => (
              <IconMaterialIcons
                name={'playlist-add'}
                size={32}
                color={tw.color(`neutral-800`)}
                onPress={() => navigation.push('ServerAdd')}
              />)
          })
        }
      />
      <Stack.Screen
        name="ServerAdd"
        component={ServerAddScreen}
        options={
          ({ route, navigation }) => ({
            title: '添加服务器',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="SettingBulletin"
        component={SettingBulletinScreen}
        options={
          ({ route, navigation }) => ({
            title: '公告设置',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="BulletinCache"
        component={BulletinCacheScreen}
        options={
          ({ route, navigation }) => ({
            title: '公告缓存设置',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="SettingAddress"
        component={SettingAddressScreen}
        options={
          ({ route, navigation }) => ({
            title: '地址设置',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={
          ({ route, navigation }) => ({
            title: '关于',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="SettingFriend"
        component={SettingFriendScreen}
        options={
          ({ route, navigation }) => ({
            title: '好友设置',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="SettingFollow"
        component={SettingFollowScreen}
        options={
          ({ route, navigation }) => ({
            title: '关注设置',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="SettingFriendRequest"
        component={SettingFriendRequestScreen}
        options={
          ({ route, navigation }) => ({
            title: '好友申请设置',
            ...headerStyleOption,
          })
        }
      />
    </Stack.Navigator>
  )
}
const ReduxAppStack = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AppStack)

export default ReduxAppStack