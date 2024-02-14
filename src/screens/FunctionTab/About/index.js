import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Toast } from '@ant-design/react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import tw from '../../../lib/tailwind'

//地址标记
const AboutScreen = (props) => {

  const copyChatClient = () => {
    Toast.success('拷贝成功！', 1)
    Clipboard.setString('https://github.com/oxogenesis/oxo-chat-client')
  }

  const copyChatApp = () => {
    Toast.success('拷贝成功！', 1)
    Clipboard.setString('https://github.com/oxogenesis/oxo-chat-app')
  }

  const copyChatServer = () => {
    Toast.success('拷贝成功！', 1)
    Clipboard.setString('https://github.com/oxogenesis/oxo-chat-server')
  }

  const copyWiki = () => {
    Toast.success('拷贝成功！', 1)
    Clipboard.setString('https://github.com/oxogenesis/oxo-chat-client/wiki')
  }

  const copyWallet = () => {
    Toast.success('拷贝成功！', 1)
    Clipboard.setString('https://github.com/oxogenesis/oxo-chat-wallet')
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <TouchableOpacity onPress={() => { copyChatServer() }}>
        <Text style={tw`w-full text-base font-bold text-neutral-800`}>
          {`服务端源码：\nhttps://github.com/oxogenesis/oxo-chat-server`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { copyChatApp() }}>
        <Text style={tw`w-full text-base font-bold text-neutral-800`}>
          {`App源码：\nhttps://github.com/oxogenesis/oxo-chat-app`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { copyChatClient() }}>
        <Text style={tw`w-full text-base font-bold text-neutral-800`}>
          {`客户端源码（停止维护）：\nhttps://github.com/oxogenesis/oxo-chat-client`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { copyWiki() }}>
        <Text style={tw`w-full text-base font-bold text-neutral-800`}>
          {`wiki：\nhttps://github.com/oxogenesis/oxo-chat-client/wiki`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { copyWallet() }}>
        <Text style={tw`w-full text-base font-bold text-neutral-800`}>
          {`钱包：\nhttps://github.com/oxogenesis/oxo-wallet`}
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