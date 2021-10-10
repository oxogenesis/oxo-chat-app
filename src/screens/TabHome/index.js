import * as React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { useNavigation, useRoute } from '@react-navigation/native'
import TabSessionScreen from '../TabSession'
import TabBulletinScreen from '../TabBulletin'
import TabAddressBookScreen from '../TabAddressBook'
import TabSettingScreen from '../TabSetting'

import IconAnt from 'react-native-vector-icons/AntDesign'
import { connect } from 'react-redux'

const Tab = createBottomTabNavigator()

//登录后界面
class TabHomeScreen extends React.Component {
  render() {
    return (
      <Tab.Navigator
        screenOptions={{
          "tabBarActiveTintColor": "red",
          "tabBarInactiveTintColor": "white",
          "tabBarActiveBackgroundColor": "pink",
          "tabBarInactiveBackgroundColor": "grey",
          "tabBarStyle": [
            {
              "display": "flex"
            },
            null
          ]
        }}>
        <Tab.Screen name="TabSession" component={TabSessionScreen} options={{
          tabBarLabel: '聊天',
          headerShown: false,
          tabBarBadge: this.props.avatar.get("CountUnreadMessage"),
          tabBarIcon: (tintColor, focusd) => (
            <IconAnt
              name={'message1'}
              size={32}
            />
          )
        }} />
        <Tab.Screen name="TabBulletin" component={TabBulletinScreen} options={{
          tabBarLabel: '公告',
          headerShown: false,
          tabBarIcon: (tintColor, focusd) => (
            <IconAnt
              name={'notification'}
              size={32}
            />
          )
        }} />
        <Tab.Screen name="TabAddressBook" component={TabAddressBookScreen} options={{
          tabBarLabel: '地址薄',
          headerShown: false,
          tabBarIcon: (tintColor, focusd) => (
            <IconAnt
              name={'contacts'}
              size={32}
            />
          )
        }} />
        <Tab.Screen name="TabSetting" component={TabSettingScreen} options={{
          tabBarLabel: '设置',
          headerShown: false,
          tabBarIcon: (tintColor, focusd) => (
            <IconAnt
              name={'setting'}
              size={32}
            />
          )
        }} />
      </Tab.Navigator>
    )
  }
}

const ReduxTabHomeScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabHomeScreen)

//export default TabHomeScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxTabHomeScreen{...props} navigation={navigation} route={route} />
}