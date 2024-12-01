import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { FileChunkSize, MessageObjectType, ObjectType } from '../../../lib/Const'
import ViewEmpty from '../../../component/ViewEmpty'
import TextTimestamp from '../../../component/TextTimestamp'
import TextFileSize from '../../../component/TextFileSize'
import TextName from '../../../component/TextName'
import tw from '../../../lib/tailwind'
import { Dirs, FileSystem } from 'react-native-file-access'
import { ConsoleWarn } from '../../../lib/Util'

//文件浏览界面
const ChatFileSelectScreen = (props) => {
  const [fileList, setList] = useState([])
  const [parentDir, setParentDir] = useState([])

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
      ConsoleWarn(stat)
      let file_hash = await FileSystem.hash(path, 'SHA-1')
      file_hash = file_hash.toUpperCase()

      // TODO 1
      let file_encrypt_hash

      let fileChunk = Math.ceil(stat.size / FileChunkSize)
      let filename = stat.filename.split('.')
      let content = {
        ObjectType: MessageObjectType.ChatFile,
        Name: filename[0],
        Ext: filename[1],
        Size: stat.size,
        Chunk: fileChunk,
        Hash: file_hash,
        EHash: file_encrypt_hash
      }
      ConsoleWarn(content)
      props.navigation.replace('Session', {
        address: props.route.params.address,
        content: content
      })
    }
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      {
        <View style={tw`h-full`}>
          {
            Dirs.SDCardDir != props.route.params.dir &&
            <TouchableOpacity onPress={() => props.navigation.replace('FileSelect', { address: props.route.params.address, dir: parentDir })} >
              <View style={tw`flex flex-row bg-stone-100 dark:bg-stone-500 p-5px mb-1px`}>
                <View>
                  <Text>
                    <TextName name={`返回上一级目录`} />
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
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
                      <TouchableOpacity key={index} onPress={() => props.navigation.replace('FileSelect', { address: props.route.params.address, dir: item.path })} >
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