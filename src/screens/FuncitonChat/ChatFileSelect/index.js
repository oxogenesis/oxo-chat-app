import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import { MessageObjectType } from '../../../lib/Const'
import ViewEmpty from '../../../component/ViewEmpty'
import TextTimestamp from '../../../component/TextTimestamp'
import TextFileSize from '../../../component/TextFileSize'
import TextName from '../../../component/TextName'
import { FileMaxSize, DefaultPartition } from '../../../lib/Const'
import { FileSystem, Dirs } from 'react-native-file-access'
import { AesEncrypt, DHSequence } from '../../../lib/OXO'
import tw from '../../../lib/tailwind'
import { ConsoleWarn } from '../../../lib/Util'
import DirUpLevel from '../../../component/DirUpLevel'

//文件浏览界面
const ChatFileSelectScreen = (props) => {
  const [fileList, setList] = useState([])
  const [parentDir, setParentDir] = useState([])

  const TmpChatFilePath = `${Dirs.DocumentDir}/TmpChatFile/${props.avatar.get("Address")}`
  const CacheFilePath = `${Dirs.DocumentDir}/CacheFile/${props.avatar.get("Address")}`
  const friend_address = props.route.params.address
  const self_address = props.avatar.get("Address")

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      loadFileList()
    })
  })

  const loadFileList = async () => {
    let parentDir = Dirs.SDCardDir
    if (parentDir != props.route.params.dir) {
      let paths = props.route.params.dir.split('/')
      paths.pop()
      parentDir = paths.join('/')
    }
    setParentDir(parentDir)

    props.navigation.setOptions({ title: props.route.params.dir })
    let result = await FileSystem.statDir(props.route.params.dir)
    setList(result)
  }

  const composeMsg = async (path) => {
    let result = await FileSystem.exists(path)
    if (result) {
      let stat = await FileSystem.stat(path)
      if (stat.size > FileMaxSize) {
        ToastAndroid.show('错误：文件大小不能超过16Mb...',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER)
      } else {
        ConsoleWarn(stat)
        ToastAndroid.show('1.缓存文件中...',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER)
        let file_hash = await FileSystem.hash(path, 'SHA-1')
        file_hash = file_hash.toUpperCase()
        let cache_file_path = `${CacheFilePath}/${file_hash}`
        await FileSystem.cp(path, cache_file_path)

        // TODO 1
        ToastAndroid.show('2.加密文件中...',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER)
        let tmp_file = `${TmpChatFilePath}/${file_hash}`

        let timestamp = Date.now()
        let ecdh_sequence = DHSequence(DefaultPartition, timestamp, self_address, friend_address)
        let current_session_aes_key = props.avatar.get("CurrentSessionAesKey")
        ConsoleWarn(current_session_aes_key)
        if (current_session_aes_key == {} || !current_session_aes_key.AesKey || ecdh_sequence != current_session_aes_key.EcdhSequence) {
          ToastAndroid.show('会话密钥协商中，无法加密文件...',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER)
          return
        }
        try {
          let file_content = await FileSystem.readFile(cache_file_path, 'base64')
          let encrypted_content = AesEncrypt(file_content, current_session_aes_key.AesKey)
          await FileSystem.writeFile(tmp_file, encrypted_content, 'base64')
        } catch (error) {
          ToastAndroid.show('错误：' + error,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER)
          return
        }
        let file_encrypt_hash = await FileSystem.hash(tmp_file, 'SHA-1')
        let tmp_chat_file_path = `${TmpChatFilePath}/${file_encrypt_hash}`
        FileSystem.mv(tmp_file, tmp_chat_file_path)
        ConsoleWarn(file_encrypt_hash)

        let filename = stat.filename.split('.')
        let content = {
          ObjectType: MessageObjectType.ChatFile,
          Name: filename[0],
          Ext: filename[1],
          Size: stat.size,
          Hash: file_hash,
          EHash: file_encrypt_hash,
          Timestamp: timestamp
        }
        ConsoleWarn(content)
        props.navigation.replace('Session', {
          address: props.route.params.address,
          content: content
        })
      }
    }
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      {
        <View style={tw`h-full`}>
          {
            Dirs.SDCardDir != props.route.params.dir &&
            <DirUpLevel onPress={() => props.navigation.replace('ChatFileSelect', { address: props.route.params.address, dir: parentDir })} />
          }
          {
            fileList.length > 0 ?
              <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                {
                  fileList.map((item, index) => (
                    item.type == 'file' ?
                      <TouchableOpacity key={index} onPress={() => composeMsg(item.path)} >
                        <View style={tw`flex flex-row bg-stone-100 dark:bg-stone-500 p-5px mb-1px`}>
                          <View>
                            <Text>
                              <TextName name={item.filename} />
                            </Text>
                            <Text>
                              <TextTimestamp timestamp={item.lastModified} />
                              <TextFileSize size={item.size} />
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      :
                      <TouchableOpacity key={index} onPress={() => props.navigation.replace('ChatFileSelect', { address: props.route.params.address, dir: item.path })} >
                        <View style={tw`flex flex-row bg-stone-100 dark:bg-stone-500 p-5px mb-1px`}>
                          <View>
                            <Text>
                              <TextName name={item.filename} />
                            </Text>
                            <Text>
                              <TextTimestamp timestamp={item.lastModified} />
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                  ))
                }
              </ScrollView>
              :
              <ViewEmpty msg={`目录为空...`} />
          }
        </View>
      }
    </View>
  )
}

const ReduxChatFileSelectScreen = connect((state) => {
  return {
    avatar: state.avatar,
    master: state.master
  }
})(ChatFileSelectScreen)

export default ReduxChatFileSelectScreen