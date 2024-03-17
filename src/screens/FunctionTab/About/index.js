import React from 'react'
import { View, Text, ToastAndroid, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import Clipboard from '@react-native-clipboard/clipboard'
import tw from '../../../lib/tailwind'

//地址标记
const AboutScreen = (props) => {

  const copyChatClient = () => {
    ToastAndroid.show('拷贝成功！',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
    Clipboard.setString('https://github.com/oxogenesis/oxo-chat-client')
  }

  const copyChatApp = () => {
    ToastAndroid.show('拷贝成功！',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
    Clipboard.setString('https://github.com/oxogenesis/oxo-chat-app')
  }

  const copyChatServer = () => {
    ToastAndroid.show('拷贝成功！',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
    Clipboard.setString('https://github.com/oxogenesis/oxo-chat-server')
  }

  const copyWiki = () => {
    ToastAndroid.show('拷贝成功！',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
    Clipboard.setString('https://github.com/oxogenesis/oxo-chat-client/wiki')
  }

  const copyWallet = () => {
    ToastAndroid.show('拷贝成功！',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
    Clipboard.setString('https://github.com/oxogenesis/oxo-chat-wallet')
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <TouchableOpacity onPress={() => { copyChatServer() }}>
        <Text style={tw`w-full text-base font-bold text-slate-800 dark:text-slate-200`}>
          {`服务端源码：`}
        </Text>
        <Text style={tw`w-full text-base text-slate-800 dark:text-slate-200`}>
          {`https://github.com/oxogenesis/oxo-chat-server`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { copyChatApp() }}>
        <Text style={tw`w-full text-base font-bold text-slate-800 dark:text-slate-200`}>
          {`App源码：`}
        </Text>
        <Text style={tw`w-full text-base text-slate-800 dark:text-slate-200`}>
          {`https://github.com/oxogenesis/oxo-chat-app`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { copyChatClient() }}>
        <Text style={tw`w-full text-base font-bold text-slate-800 dark:text-slate-200`}>
          {`客户端源码（停止维护）：`}
        </Text>
        <Text style={tw`w-full text-base text-slate-800 dark:text-slate-200`}>
          {`https://github.com/oxogenesis/oxo-chat-client`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { copyWiki() }}>
        <Text style={tw`w-full text-base font-bold text-slate-800 dark:text-slate-200`}>
          {`wiki：`}
        </Text>
        <Text style={tw`w-full text-base text-slate-800 dark:text-slate-200`}>
          {`https://github.com/oxogenesis/oxo-chat-client/wiki`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { copyWallet() }}>
        <Text style={tw`w-full text-base font-bold text-slate-800 dark:text-slate-200`}>
          {`钱包：`}
        </Text>
        <Text style={tw`w-full text-base text-slate-800 dark:text-slate-200`}>
          {`https://github.com/oxogenesis/oxo-wallet`}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const ReduxAboutScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AboutScreen)

export default ReduxAboutScreen