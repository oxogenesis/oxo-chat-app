import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity, ToastAndroid, FlatList, KeyboardAvoidingView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AddressToName, ConsoleWarn } from '../../../lib/Util'
import { DefaultPartition, MessageObjectType } from '../../../lib/Const'
import { DHSequence } from '../../../lib/OXO'
import { actionType } from '../../../redux/actions/actionType'
import { connect } from 'react-redux'
import tw from '../../../lib/tailwind'
import ItemMessageFriend from '../../../component/ItemMessageFriend'
import ItemMessageMe from '../../../component/ItemMessageMe'
import MsgObjectChatFile from '../../../component/MsgObjectChatFile'

//聊天会话界面
const SessionScreen = (props) => {
  const listRef = useRef(null)
  const [msg_input, setMsgInput] = useState('')
  const [msg_object, setMsgObject] = useState({})
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [keyboardAppearance, setKeyboardAppearance] = useState()

  const data = props.avatar.get("CurrentMessageList")
  const friend_address = props.route.params.address
  const friend_name = AddressToName(props.avatar.get('AddressMap'), props.route.params.address)
  const self_address = props.avatar.get("Address")

  const updateChatFile = (tmp) => {
    setMsgObject(prevMsgObject => ({
      ...prevMsgObject,
      ObjectType: tmp.ObjectType,
      Name: tmp.Name,
      Ext: tmp.Ext,
      Size: tmp.Size,
      Hash: tmp.Hash,
      EHash: tmp.EHash,
      Timestamp: tmp.Timestamp
    }))
  }

  const updateBulletin = (tmp) => {
    setMsgObject(prevMsgObject => ({
      ...prevMsgObject,
      Name: AddressToName(props.avatar.get('AddressMap'), tmp.Address),
      Sequence: tmp.Sequence
    }))
  }

  const sendMessage = () => {
    let timestamp = Date.now()
    let new_msg_input = msg_input.trim()
    if (msg_input == "") {
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
          message: new_msg_input,
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

      let content = props.route.params.content
      ConsoleWarn(`SessionScreen`)
      ConsoleWarn(content)
      if (content != null) {
        if (content.ObjectType == MessageObjectType.ChatFile) {
          updateChatFile(content)
        } else if (content.ObjectType == MessageObjectType.Bulletin) {
          updateBulletin(content)
        } else {
          setMsgInput(JSON.stringify(content))
        }
      }

      loadMessageList(true)

      listRef.current.scrollToEnd()

      if (props.master.get('Dark')) {
        setKeyboardAppearance('dark')
      } else {
        setKeyboardAppearance('light')
      }
    })
  })

  // useEffect(() => {
  //   return props.navigation.addListener('blur', () => {
  //     props.dispatch({
  //       type: actionType.avatar.setCurrentSession
  //     })
  //     props.dispatch({
  //       type: actionType.avatar.setCurrentSessionAesKey
  //     })
  //   })
  // })

  //向下拉，加载更到本地消息
  const refreshing = () => {
    if (refreshFlag) {
      ConsoleWarn("现在正在刷新")
    } else {
      ConsoleWarn("下拉加载")
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
        <View style={tw`w-4/5`}>
          {
            msg_object && msg_object.ObjectType ?
              <TouchableOpacity onPress={() => setMsgObject(null)} >
                {
                  msg_object.ObjectType == MessageObjectType.ChatFile &&
                  <MsgObjectChatFile object={msg_object} />
                }
                {

                }
              </TouchableOpacity >
              :
              <TextInput
                placeholderTextColor={tw.color('stone-500')}
                style={tw`border-solid border-t border-gray-300 dark:border-gray-700 text-sm text-slate-800 dark:text-slate-200`}
                placeholder="请输入消息..."
                value={msg_input}
                multiline={true}
                keyboardAppearance={keyboardAppearance}
                onFocus={handleFocus}
                onChangeText={text => setMsgInput(text)}
              />
          }
        </View>
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