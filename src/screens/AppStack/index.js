
import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { actionType } from '../../redux/actions/actionType'
import IconAnt from 'react-native-vector-icons/AntDesign'
import IconFeather from 'react-native-vector-icons/Feather'
//import IconEntypo from 'react-native-vector-icons/Entypo'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import IconFontisto from 'react-native-vector-icons/Fontisto'

import MasterKeyScreen from '../FunctionMain/MasterKey'
import UnlockScreen from '../FunctionMain/Unlock'
import AvatarListScreen from '../FunctionMain/AvatarList'
import AvatarCreateScreen from '../FunctionMain/AvatarCreate'
import AvatarCreateFromScanSeedQrcodeScreen from '../FunctionMain/AvatarCreateFromScanSeedQrcode'
import AboutScreen from '../FunctionMain/About'
import AddressSelectScreen from '../FunctionMain/AddressSelect'

import AvatarNameEditScreen from '../FunctionSetting/AvatarNameEdit'
import AvatarSeedScreen from '../FunctionSetting/AvatarSeed'
import AvatarSeedQrcodeScreen from '../FunctionSetting/AvatarSeedQrcode'
import SettingMeScreen from '../FunctionSetting/SettingMe'
import SettingNetworkScreen from '../FunctionSetting/SettingNetwork'
import SettingBulletinScreen from '../FunctionSetting/SettingBulletin'
import SettingAddressScreen from '../FunctionSetting/SettingAddress'
import SettingFriendScreen from '../FunctionSetting/SettingFriend'
import SettingFollowScreen from '../FunctionSetting/SettingFollow'
import SettingFriendRequestScreen from '../FunctionSetting/SettingFriendRequest'

import TabHomeScreen from '../FunctionTab/TabHome'

import BulletinScreen from '../FunctionBulletin/Bulletin'
import BulletinRandomScreen from '../FunctionBulletin/BulletinRandom'
import BulletinInfoScreen from '../FunctionBulletin/BulletinInfo'
import BulletinListScreen from '../FunctionBulletin/BulletinList'
import BulletinPublishScreen from '../FunctionBulletin/BulletinPublish'
import BulletinCacheScreen from '../FunctionBulletin/BulletinCache'

import SessionScreen from '../FuncitonChat/Session'

import AddressMarkScreen from '../FunctionContact/AddressMark'
import AddressAddScreen from '../FunctionContact/AddressAdd'
import AddressAddFromQrcodeScreen from '../FunctionContact/AddressAddFromQrcode'
import AddressEditScreen from '../FunctionContact/AddressEdit'
import AddressScanScreen from '../FunctionContact/AddressScan'

import { ThemeContext } from '../../theme/theme-context'
import tw from 'twrnc'

const Stack = createStackNavigator()

const AppStack = (props) => {
  const { theme } = useContext(ThemeContext)

  const headerStyleOption = {
    headerStyle: {
      backgroundColor: theme.tab_view,
    },
    headerTitleStyle: {
      color: theme.tab_text,
    },
    headerTintColor: theme.tab_text
  }

  return (
    <Stack.Navigator initialRouteName="MasterKey">
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
                color={theme.text1}
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
                color={theme.text1}
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
            title: '种子扫描',
            ...headerStyleOption,
          })
        }
      />
      <Stack.Screen
        name="Bulletin"
        component={BulletinScreen}
        options={
          ({ route, navigation }) => ({
            title: "公告",
            ...headerStyleOption,
            headerRight: () => (
              <IconFontisto
                name={'info'}
                size={32}
                color={theme.text1}
                onPress={() => navigation.push('BulletinInfo', { hash: route.params.hash })}
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
            ...headerStyleOption,
            headerRight: () => (
              <IconMaterial
                name={'refresh'}
                size={32}
                color={theme.text1}
                onPress={() => navigation.replace('BulletinRandom')}
              />)
          })
        }
      />
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
                color={theme.text1}
                onPress={() => navigation.push('AddressMark', {
                  address: route.params.address
                })}
              />)
          })
        }
      />
      <Stack.Screen
        name="BulletinList"
        component={BulletinListScreen}
        options={
          ({ route, navigation }) => ({
            title: "公告列表",
            ...headerStyleOption,
            headerRight: () => (
              <IconMaterial
                name={'post-add'}
                size={32}
                color={theme.text1}
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
    </Stack.Navigator>
  )
}

export default AppStack