/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider } from '@ant-design/react-native'

import { connect } from 'react-redux'

import tw from './lib/tailwind'
import { useDeviceContext, useAppColorScheme } from 'twrnc'

import AppStack from './screens/AppStack'

const Stack = createStackNavigator()

const App = (props) => {
  // const { toggle } = useContext(ThemeContext)
  // // console.log('默认获取的主题',props.avatar.get('Theme'))
  // useEffect(() => {
  //   toggle(props.avatar.get('Theme'))
  // }, [props.avatar.get('Theme')])

  // 1️⃣  opt OUT of listening to DEVICE color scheme events
  useDeviceContext(tw, { withDeviceColorScheme: false })

  // 2️⃣  use the `useAppColorScheme` hook to get a reference to the current color
  // scheme, with some functions to modify it (triggering re-renders) when you need to
  const [colorScheme, toggleColorScheme, setColorScheme] = useAppColorScheme(tw)

  return (
    <Provider>
      <NavigationContainer>
        <AppStack props={props} />
      </NavigationContainer>
    </Provider>
  )
}

export default connect((state) => {
  return {
    master: state.master,
    avatar: state.avatar
  }
})(App)