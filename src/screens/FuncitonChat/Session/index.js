import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity, ToastAndroid, FlatList, KeyboardAvoidingView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AddressToName } from '../../../lib/Util'
import { DefaultPartition } from '../../../lib/Const'
import { DHSequence } from '../../../lib/OXO'
import { actionType } from '../../../redux/actions/actionType'
import { connect } from 'react-redux'
import tw from '../../../lib/tailwind'
import ItemMessageFriend from '../../../component/ItemMessageFriend'
import ItemMessageMe from '../../../component/ItemMessageMe'

//聊天会话界面
const SessionScreen = (props) => {
  const listRef = useRef(null)
  const [message_input, setMsgInput] = useState('')
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [keyboardAppearance, setKeyboardAppearance] = useState()

  const data = props.avatar.get("CurrentMessageList")
  const friend_address = props.route.params.address
  const friend_name = AddressToName(props.avatar.get('AddressMap'), props.route.params.address)
  const self_address = props.avatar.get("Address")

  const sendMessage = () => {
    let timestamp = Date.now()
    let newMessage_input = message_input.trim()
    if (message_input == "") {
      ToastAndroid.show('消息不能为空...',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER)
    } else {
      let ecdh_sequence = DHSequence(DefaultPartition, timestamp, self_address, friend_address)
      let current_session_aes_key = props.avatar.get("CurrentSessionAesKey")
      if (current_session_aes_key == {} || !current_session_aes_key.AesKey || ecdh_sequence != current_session_aes_key.EcdhSequence) {
        ToastAndroid.show('会话密钥协商中，无法加密消息...',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER)
      } else {
        props.dispatch({
          type: actionType.avatar.SendFriendMessage,
          address: friend_address,
          message: newMessage_input,
          timestamp: timestamp
        })
        listRef.current.scrollToEnd()
        setMsgInput('')
      }
    }
  }

  const loadMessageList = (init_flag) => {
    props.dispatch({
      type: actionType.avatar.LoadCurrentMessageList,
      init_flag: init_flag,
      address: props.route.params.address
    })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      props.navigation.setOptions({ title: friend_name })

      props.dispatch({
        type: actionType.avatar.LoadCurrentSession,
        address: props.route.params.address
      })

      let message_input = ''
      if (props.route.params.content != null) {
        message_input = JSON.stringify(props.route.params.content)
        // console.log(message_input)
      }
      setMsgInput(message_input)

      loadMessageList(true)

      listRef.current.scrollToEnd()

      if (props.master.get('Dark')) {
        setKeyboardAppearance('dark')
      } else {
        setKeyboardAppearance('light')
      }
    })
  })

  useEffect(() => {
    return props.navigation.addListener('blur', () => {
      props.dispatch({
        type: actionType.avatar.setCurrentSession
      })
      props.dispatch({
        type: actionType.avatar.setCurrentSessionAesKey
      })
    })
  })

  //向下拉，加载更到本地消息
  const refreshing = () => {
    if (refreshFlag) {
      console.log("现在正在刷新")
    } else {
      console.log("下拉加载")
      setRefreshFlag(true)
      loadMessageList(false)
      setRefreshFlag(false)
    }
  }

  const handleContentSizeChange = () => {
    listRef.current.scrollToEnd()
  }

  const handleFocus = () => {
    setTimeout(() => {
      listRef.current.scrollToEnd()
    }, 1000)
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 flex flex-col relative`}>
      <FlatList
        style={tw`mb-55px p-5px`}
        ref={listRef}
        data={data}
        keyExtractor={item => item.Hash}
        refreshing={refreshFlag}
        onRefresh={refreshing}
        onContentSizeChange={handleContentSizeChange}
        renderItem={({ item }) => {
          if (item.SourAddress == friend_address) {
            return (
              <ItemMessageFriend message={item} friend_address={friend_address} />
            )
          }
          else {
            return (
              <ItemMessageMe message={item} self_address={self_address} />
            )
          }
        }}
      />

      <View style={tw`w-full flex flex-row-reverse absolute bottom-0`}>
        <View style={tw`w-1/5`}>
          <TouchableOpacity style={tw`h-full rounded-none bg-green-500`} onPress={() => sendMessage()}>
            <Text style={tw`h-full align-middle text-lg text-center font-bold text-slate-200`}>
              发送
            </Text>
          </TouchableOpacity>
        </View>
        <View style={tw`w-8/10`}>
          <TextInput
            placeholderTextColor={tw.color('stone-500')}
            style={tw`border-solid border-t border-gray-300 dark:border-gray-700 text-sm text-slate-800 dark:text-slate-200`}
            placeholder="请输入消息..."
            value={message_input}
            multiline={true}
            keyboardAppearance={keyboardAppearance}
            onFocus={handleFocus}
            onChangeText={text => setMsgInput(text)}
          />
        </View>
        {/* <View style={tw`w-1/10`}>
          <TouchableOpacity style={tw`h-full rounded-none bg-yellow-500`} onPress={() => props.navigation.push('FileSelect', { address: props.route.params.address, dir: Dirs.SDCardDir })} >
            <Text style={tw`h-full align-middle text-lg text-center font-bold text-slate-200`}>
              +
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View >
  )
}

const ReduxSessionScreen = connect((state) => {
  return {
    avatar: state.avatar,
    master: state.master
  }
})(SessionScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxSessionScreen{...props} navigation={navigation} route={route} />
}