import * as React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import SessionListScreen from '../TabSession'
import TabBulletinScreen from '../TabBulletin'
import TabAddressBookScreen from '../TabAddressBook'
import TabSettingScreen from '../TabSetting'

import IconAnt from 'react-native-vector-icons/AntDesign'

const Tab = createBottomTabNavigator()

//登录后界面
class TabHomeScreen extends React.Component {
  render() {
    return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: 'red',
          inactiveTintColor: 'white',
          activeBackgroundColor: 'pink',
          inactiveBackgroundColor: 'grey'
        }}>
        <Tab.Screen name="SessionList" component={SessionListScreen} options={{
          tabBarLabel: '聊天',
          tabBarBadge: 8,
          tabBarIcon: (tintColor, focusd) => (
            <IconAnt
              name={'message1'}
              size={24}
            />
          )
        }} />
        <Tab.Screen name="TabBulletin" component={TabBulletinScreen} options={{
          tabBarLabel: '公告',
          tabBarIcon: (tintColor, focusd) => (
            <IconAnt
              name={'notification'}
              size={24}
            />
          )
        }} />
        <Tab.Screen name="TabAddressBook" component={TabAddressBookScreen} options={{
          tabBarLabel: '地址薄',
          tabBarIcon: (tintColor, focusd) => (
            <IconAnt
              name={'contacts'}
              size={24}
            />
          )
        }} />
        <Tab.Screen name="TabSetting" component={TabSettingScreen} options={{
          tabBarLabel: '设置',
          tabBarIcon: (tintColor, focusd) => (
            <IconAnt
              name={'setting'}
              size={24}
            />
          )
        }} />
      </Tab.Navigator>
    )
  }
}

export default TabHomeScreen