/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './src/app'
import { name as appName } from './app.json'

import React from 'react'
import { Provider } from 'react-redux'
import store from './src/redux/store'

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

AppRegistry.registerComponent(appName, () => ReduxApp)