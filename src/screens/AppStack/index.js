
import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import IconAnt from 'react-native-vector-icons/AntDesign'
import IconFeather from 'react-native-vector-icons/Feather'
//import IconEntypo from 'react-native-vector-icons/Entypo'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import IconFontisto from 'react-native-vector-icons/Fontisto'

import MasterKeyScreen from '../MasterKey'
import UnlockScreen from '../Unlock'
import AvatarListScreen from '../AvatarList'
import AvatarCreateScreen from '../AvatarCreate'
import AvatarNameEditScreen from '../AvatarNameEdit'
import AvatarSeedScreen from '../AvatarSeed'
import AvatarSeedQrcodeScreen from '../AvatarSeedQrcode'
import AboutScreen from '../About'
import AvatarCreateFromScanSeedQrcodeScreen from '../AvatarCreateFromScanSeedQrcode'
import TabHomeScreen from '../TabHome'
import BulletinScreen from '../Bulletin'
import BulletinRandomScreen from '../BulletinRandom'
import BulletinInfoScreen from '../BulletinInfo'
import SessionScreen from '../Session'
import BulletinListScreen from '../BulletinList'
import BulletinPublishScreen from '../BulletinPublish'
import AddressMarkScreen from '../AddressMark'
import AddressAddScreen from '../AddressAdd'
import AddressAddFromQrcodeScreen from '../AddressAddFromQrcode'
import AddressEditScreen from '../AddressEdit'
import AddressSelectScreen from '../AddressSelect'
import AddressScanScreen from '../AddressScan'
import SettingMeScreen from '../SettingMe'
import SettingNetworkScreen from '../SettingNetwork'
import SettingBulletinScreen from '../SettingBulletin'
import SettingAddressScreen from '../SettingAddress'
import SettingFriendScreen from '../SettingFriend'
import SettingFollowScreen from '../SettingFollow'
import SettingFriendRequestScreen from '../SettingFriendRequest'
import BulletinCacheScreen from '../BulletinCache'
import { ThemeContext } from '../../theme/theme-context'
const Stack = createStackNavigator()

const StackView = (props) => {
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
      <Stack.Screen name="MasterKey" component={MasterKeyScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Unlock" component={UnlockScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TabHome" component={TabHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="AvatarList"
        component={AvatarListScreen}
        options={
          ({ route, navigation }) => ({
            title: "????????????",
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
        } />
      <Stack.Screen
        name="AvatarCreate"
        component={AvatarCreateScreen}
        options={
          ({ route, navigation }) => ({
            title: "????????????",
            ...headerStyleOption,
            headerRight: () => (
              <IconAnt
                name={'qrcode'}
                size={32}
                color={theme.text1}
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
            title: '????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="Bulletin"
        component={BulletinScreen}
        options={
          ({ route, navigation }) => ({
            title: "??????",
            ...headerStyleOption,
            headerRight: () => (
              <IconFontisto
                name={'info'}
                size={32}
                color={theme.text1}
                onPress={() => navigation.push('BulletinInfo', { hash: route.params.hash })}
              />)
          })
        } />
      <Stack.Screen
        name="BulletinRandom"
        component={BulletinRandomScreen}
        options={
          ({ route, navigation }) => ({
            title: "?????????????????????",
            ...headerStyleOption
          })
        } />
      <Stack.Screen
        name="Session"
        component={SessionScreen}
        options={
          ({ route, navigation }) => ({
            title: "??????",
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
        } />
      <Stack.Screen
        name="BulletinList"
        component={BulletinListScreen}
        options={
          ({ route, navigation }) => ({
            title: "????????????",
            ...headerStyleOption,
            headerRight: () => (
              <IconMaterial
                name={'post-add'}
                size={32}
                color={theme.text1}
                onPress={() => navigation.navigate('BulletinPublish')}
              />)
          })
        } />
      <Stack.Screen
        name="BulletinPublish"
        component={BulletinPublishScreen}
        options={
          ({ route, navigation }) => ({
            title: "????????????",
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="AddressMark"
        component={AddressMarkScreen}
        options={
          ({ route, navigation }) => ({
            title: '????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="AddressAdd"
        component={AddressAddScreen}
        options={
          ({ route, navigation }) => ({
            title: '????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="AddressAddFromQrcode"
        component={AddressAddFromQrcodeScreen}
        options={
          ({ route, navigation }) => ({
            title: '???????????????????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="AddressEdit"
        component={AddressEditScreen}
        options={
          ({ route, navigation }) => ({
            title: '??????????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="AddressSelect"
        component={AddressSelectScreen}
        options={
          ({ route, navigation }) => ({
            title: '????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="BulletinInfo"
        component={BulletinInfoScreen}
        options={
          ({ route, navigation }) => ({
            title: '????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="AvatarNameEdit"
        component={AvatarNameEditScreen}
        options={
          ({ route, navigation }) => ({
            title: '????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="AvatarSeed"
        component={AvatarSeedScreen}
        options={
          ({ route, navigation }) => ({
            title: '??????????????????????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="AvatarSeedQrcode"
        component={AvatarSeedQrcodeScreen}
        options={
          ({ route, navigation }) => ({
            title: '?????????????????????????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="SettingMe"
        component={SettingMeScreen}
        headerBackTitle='??????'
        options={
          ({ route, navigation }) => ({
            title: '????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="SettingNetwork"
        component={SettingNetworkScreen}
        options={
          ({ route, navigation }) => ({
            title: '????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="SettingBulletin"
        component={SettingBulletinScreen}
        options={
          ({ route, navigation }) => ({
            title: '????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="BulletinCache"
        component={BulletinCacheScreen}
        options={
          ({ route, navigation }) => ({
            title: '??????????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="SettingAddress"
        component={SettingAddressScreen}
        options={
          ({ route, navigation }) => ({
            title: '????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={
          ({ route, navigation }) => ({
            title: '??????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="SettingFriend"
        component={SettingFriendScreen}
        options={
          ({ route, navigation }) => ({
            title: '????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="SettingFollow"
        component={SettingFollowScreen}
        options={
          ({ route, navigation }) => ({
            title: '????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="SettingFriendRequest"
        component={SettingFriendRequestScreen}
        options={
          ({ route, navigation }) => ({
            title: '??????????????????',
            ...headerStyleOption,
          })
        } />
      <Stack.Screen
        name="AddressScan"
        component={AddressScanScreen}
        options={
          ({ route, navigation }) => ({
            title: '????????????',
            ...headerStyleOption,
          })
        } />
    </Stack.Navigator>
  )
}

export default StackView