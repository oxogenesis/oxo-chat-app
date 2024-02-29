import React, { useState, useEffect, useRef } from 'react'
import { Button, Flex, Toast } from '@ant-design/react-native'
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, KeyboardAvoidingView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AddressToName } from '../../../lib/Util'
import { DefaultPartition } from '../../../lib/Const'
import { DHSequence } from '../../../lib/OXO'
import { actionType } from '../../../redux/actions/actionType'
import { connect } from 'react-redux'
import Clipboard from '@react-native-clipboard/clipboard'
import AvatarImage from '../../../component/AvatarImage'
import LinkBulletin from '../../../component/LinkBulletin'
import LinkMsgInfo from '../../../component/LinkMsgInfo'
import TextTimestamp from '../../../component/TextTimestamp'
import tw from '../../../lib/tailwind'

//聊天会话界面
const SessionScreen = (props) => {
  const listRef = useRef(null)
  const [message_input, setMsgInput] = useState('')
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [keyboardAppearance, setKeyboardAppearance] = useState()

  const aes_key = props.avatar.get('CurrentSessionAesKey')
  const data = props.avatar.get("CurrentMessageList")
  const friend_address = props.route.params.address
  const friend_name = AddressToName(props.avatar.get('AddressMap'), props.route.params.address)
  const self_address = props.avatar.get("Address")

  const sendMessage = () => {
    let timestamp = Date.now()
    let newMessage_input = message_input.trim()
    if (message_input == "") {
      Toast.success('消息不能为空...', 1)
    } else {
      let ecdh_sequence = DHSequence(DefaultPartition, timestamp, self_address, friend_address)
      let current_session_aes_key = props.avatar.get("CurrentSessionAesKey")
      if (ecdh_sequence != current_session_aes_key.EcdhSequence) {
        Toast.success('握手未完成...', 1)
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

  const copyToClipboard = (content) => {
    Clipboard.setString(content)
    Toast.success('拷贝成功！', 1)
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
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px flex flex-col relative`}>
      <FlatList
        style={tw`mb-55px`}
        ref={listRef}
        data={data}
        keyExtractor={item => item.Hash}
        refreshing={refreshFlag}
        onRefresh={refreshing}
        onContentSizeChange={handleContentSizeChange}
        renderItem={({ item }) => {
          if (item.SourAddress == friend_address) {
            return (
              <Flex justify="start" align="start" key={item.Hash}>
                <View style={tw``}>
                  <AvatarImage address={friend_address} />
                </View>

                <View style={tw`max-w-64 mt-5px ml-5px`}>
                  <Text style={tw`text-left`}>
                    <LinkMsgInfo hash={item.Hash} sequence={item.Sequence} />
                    <TextTimestamp timestamp={item.Timestamp} textSize={'text-xs'} />
                  </Text>

                  <View style={tw`flex flex-row`}>
                    <Text style={tw`mr-5px mt-2px p-2px ${item.Confirmed ? 'bg-green-500' : 'bg-neutral-100'} rounded-r-md rounded-bl-md`}>
                      {
                        item.IsObject ?
                          <LinkBulletin address={item.ObjectJson.Address} sequence={item.ObjectJson.Sequence} hash={item.ObjectJson.Hash} to={props.route.params.address} />
                          :
                          <Text style={tw`text-sm text-left`} onPress={() => { copyToClipboard(item.Content) }}>
                            {item.Content}
                          </Text>
                      }
                    </Text>
                  </View>
                </View>
              </Flex>
            )
          }
          else {
            return (
              <Flex justify="end" align="start" key={item.Hash}>
                <View style={tw`ml-50px max-w-64 mt-5px`}>
                  <Text style={tw`text-right mr-5px`}>
                    <LinkMsgInfo hash={item.Hash} sequence={item.Sequence} />
                    <TextTimestamp timestamp={item.Timestamp} textSize={'text-xs'} />
                  </Text>

                  <View style={tw`flex flex-row-reverse`}>
                    <Text style={tw`mr-5px mt-2px p-2px ${item.Confirmed ? 'bg-green-500' : 'bg-neutral-100'} rounded-l-md rounded-br-md`}>
                      {
                        item.IsObject ?
                          <View style={tw``}>
                            <LinkBulletin address={item.ObjectJson.Address} sequence={item.ObjectJson.Sequence} hash={item.ObjectJson.Hash} to={props.route.params.address} />
                          </View>
                          :
                          <Text style={tw`text-sm text-right`} onPress={() => { copyToClipboard(item.Content) }}>
                            {item.Content}
                          </Text>
                      }
                    </Text>
                  </View>
                </View>

                <View>
                  <AvatarImage address={self_address} />
                </View>
              </Flex>
            )
          }
        }}
      />

      <View style={tw`w-full flex flex-row-reverse absolute bottom-0`}>
        <View style={tw`w-1/5`}>
          {
            aes_key != {} && aes_key.AesKey ?
              <Button
                style={tw`h-full rounded-none bg-green-500`}
                type='primary'
                onPress={() => sendMessage()}>
                发送
              </Button>
              :
              <Button
                style={tw`h-full rounded-none`}
                disabled={true}>
                发送
              </Button>
          }
        </View>
        <View style={tw`w-4/5`}>
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
      </View>
    </View>
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