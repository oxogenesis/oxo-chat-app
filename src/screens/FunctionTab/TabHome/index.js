import React from 'react'
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
import tw from '../../../lib/tailwind'

const Tab = createBottomTabNavigator()

//登录后界面
const TabHomeScreen = (props) => {
  return (
    <Tab.Navigator
      screenOptions={{
        "tabBarActiveTintColor": tw.color(`neutral-500`),
        "tabBarInactiveTintColor": tw.color(`neutral-500`),
        "tabBarActiveBackgroundColor": tw.color(`neutral-200`),
        "tabBarInactiveBackgroundColor": tw.color(`neutral-200`),
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
          backgroundColor: tw.color(`neutral-200`),
        },
        headerTitleStyle: {
          color: tw.color(`neutral-500`),
        },
        headerTitle: (props) => <TabBulletinHeader {...props} />,
        tabBarLabel: '公告',
        tabBarIcon: ({ focused, color, size }) => {
          if (focused) {
            return <IconAnt
              name={'notification'}
              size={32}
              color={tw.color('yellow-500')}
            />
          } else {
            return < IconAnt
              name={'notification'}
              size={32}
              color={tw.color('bg-neutral-800')}
            />
          }
        }
      }} />
      <Tab.Screen name="聊天" component={TabSessionScreen} options={{
        headerShown: true,
        headerStyle: {
          backgroundColor: tw.color(`neutral-200`),
        },
        headerTitleStyle: {
          color: tw.color(`neutral-500`),
        },
        headerTitle: (props) => <TabSessionHeader {...props} />,
        tabBarLabel: '聊天',
        tabBarBadge: props.avatar.get("CountUnreadMessage"),
        tabBarIcon: ({ focused, color, size }) => {
          if (focused) {
            return <IconAnt
              name={'message1'}
              size={32}
              color={tw.color('green-500')}
            />
          } else {
            return < IconAnt
              name={'message1'}
              size={32}
              color={tw.color('bg-neutral-800')}
            />
          }
        }
      }} />
      <Tab.Screen name="地址薄" component={TabAddressBookScreen} options={{
        headerStyle: {
          backgroundColor: tw.color(`neutral-200`),
        },
        headerTitleStyle: {
          color: tw.color(`neutral-500`),
        },
        headerTitle: (props) => <TabAddressBookHeader {...props} />,
        tabBarLabel: '地址薄',
        tabBarIcon: ({ focused, color, size }) => {
          if (focused) {
            return <IconAnt
              name={'contacts'}
              size={32}
              color={tw.color('indigo-500')}
            />
          } else {
            return < IconAnt
              name={'contacts'}
              size={32}
              color={tw.color('bg-neutral-800')}
            />
          }
        }
      }} />
      <Tab.Screen name="设置" component={TabSettingScreen} options={{
        headerShown: false,
        tabBarLabel: '设置',
        tabBarIcon: ({ focused, color, size }) => {
          if (focused) {
            return <IconAnt
              name={'setting'}
              size={32}
              color={tw.color('blue-500')}
            />
          } else {
            return < IconAnt
              name={'setting'}
              size={32}
              color={tw.color('bg-neutral-800')}
            />
          }
        }
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