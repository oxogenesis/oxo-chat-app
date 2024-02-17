import React, { useState, useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation, useRoute } from '@react-navigation/native'
import TabSessionScreen from '../TabSession'
import TabBulletinScreen from '../TabBulletin'
import TabAddressBookScreen from '../TabAddressBook'
import TabSettingScreen from '../TabSetting'
import IconAnt from 'react-native-vector-icons/AntDesign'
import { connect } from 'react-redux'
import TabHeaderBackground from '../../../component/TabHeaderBackground'
import TabBarBackground from '../../../component/TabBarBackground'
import TabBulletinHeader from '../../../component/TabBulletinHeader'
import TabSessionHeader from '../../../component/TabSessionHeader'
import TabAddressBookHeader from '../../../component/TabAddressBookHeader'
import tw from '../../../lib/tailwind'

const Tab = createBottomTabNavigator()

//登录后界面
const TabHomeScreen = (props) => {
  const [isDark, setDark] = useState()

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      let dark = props.master.get('Dark')
      setDark(dark)
    })
  })

  useEffect(() => {
    let dark = props.master.get('Dark')
    setDark(dark)
  }, [props.master])

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarBackground: (props) => <TabBarBackground {...props} />,
        tabBarInactiveTintColor: tw.color('neutral-800')
      }}>
      <Tab.Screen name="公告" component={TabBulletinScreen} options={{
        headerShown: true,
        headerBackground: (props) => <TabHeaderBackground {...props} />,
        headerTitle: (props) => <TabBulletinHeader {...props} />,
        tabBarActiveTintColor: tw.color('yellow-500'),
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
              color={tw.color('neutral-800')}
            />
          }
        }
      }} />
      <Tab.Screen name="聊天" component={TabSessionScreen} options={{
        headerShown: true,
        headerBackground: (props) => <TabHeaderBackground {...props} />,
        headerTitle: (props) => <TabSessionHeader {...props} />,
        tabBarActiveTintColor: tw.color('green-500'),
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
              color={tw.color('neutral-800')}
            />
          }
        }
      }} />
      <Tab.Screen name="地址薄" component={TabAddressBookScreen} options={{
        headerBackground: (props) => <TabHeaderBackground {...props} />,
        headerTitle: (props) => <TabAddressBookHeader {...props} />,
        tabBarActiveTintColor: tw.color('indigo-500'),
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
              color={tw.color('neutral-800')}
            />
          }
        }
      }} />
      <Tab.Screen name="设置" component={TabSettingScreen} options={{
        headerShown: false,
        tabBarActiveTintColor: tw.color('blue-500'),
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
              color={tw.color('neutral-800')}
            />
          }
        }
      }} />
    </Tab.Navigator>
  )
}

const ReduxTabHomeScreen = connect((state) => {
  return {
    avatar: state.avatar,
    master: state.master
  }
})(TabHomeScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxTabHomeScreen{...props} navigation={navigation} route={route} />
}