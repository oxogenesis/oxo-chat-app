import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation, useRoute } from '@react-navigation/native'
import TabSessionScreen from '../TabSession'
import TabBulletinScreen from '../TabBulletin'
import TabAddressBookScreen from '../TabAddressBook'
import TabSettingScreen from '../TabSetting'
import IconAnt from 'react-native-vector-icons/AntDesign'
import { connect } from 'react-redux'
import TabBulletinHeader from '../../../component/TabBulletinHeader'
import TabSessionHeader from '../../../component/TabSessionHeader'
import TabAddressBookHeader from '../../../component/TabAddressBookHeader'
import { ThemeContext } from '../../../theme/theme-context'
import tw from 'twrnc'

const Tab = createBottomTabNavigator()

//登录后界面
const TabHomeScreen = (props) => {
  const { theme } = useContext(ThemeContext)
  return (
    <Tab.Navigator
      screenOptions={{
        "tabBarActiveTintColor": tw.color('green-500'),
        "tabBarInactiveTintColor": theme.tab_text,
        "tabBarActiveBackgroundColor": theme.tab_view,
        "tabBarInactiveBackgroundColor": theme.tab_view,
        "tabBarStyle": [
          {
            "display": "flex",
            height: 65,
          },
          null
        ]
      }}>
      <Tab.Screen name="公告" component={TabBulletinScreen} options={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.tab_view,
        },
        headerTitleStyle: {
          color: theme.tab_text,
        },
        headerTitle: (props) => <TabBulletinHeader {...props} />,
        tabBarLabel: '公告',
        tabBarIcon: ({ color, focusd }) => (
          <IconAnt
            name={'notification'}
            size={32}
            color={color}
          />
        )
      }} />
      <Tab.Screen name="聊天" component={TabSessionScreen} options={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.tab_view,
        },
        headerTitleStyle: {
          color: theme.tab_text,
        },
        headerTitle: (props) => <TabSessionHeader {...props} />,
        tabBarLabel: '聊天',
        tabBarBadge: props.avatar.get("CountUnreadMessage"),
        tabBarIcon: ({ color }) => {
          return <IconAnt
            name={'message1'}
            size={32}
            color={color}
          />
        }
      }} />
      <Tab.Screen name="地址薄" component={TabAddressBookScreen} options={{
        headerStyle: {
          backgroundColor: theme.tab_view,
        },
        headerTitleStyle: {
          color: theme.tab_text,
        },
        headerTitle: (props) => <TabAddressBookHeader {...props} />,
        tabBarLabel: '地址薄',
        tabBarIcon: ({ color, focusd }) => (
          <IconAnt
            name={'contacts'}
            size={32}
            color={color}
          />
        )
      }} />
      <Tab.Screen name="设置" component={TabSettingScreen} options={{
        headerShown: false,
        tabBarLabel: '设置',
        tabBarIcon: ({ color, focusd }) => (
          <IconAnt
            name={'setting'}
            size={32}
            color={color}
          />
        )
      }} />
    </Tab.Navigator>
  )
}

const ReduxTabHomeScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabHomeScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxTabHomeScreen{...props} navigation={navigation} route={route} />
}