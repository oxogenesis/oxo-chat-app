import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { FileMaxSize } from '../../../lib/Const'
import ViewEmpty from '../../../component/ViewEmpty'
import TextTimestamp from '../../../component/TextTimestamp'
import TextFileSize from '../../../component/TextFileSize'
import TextName from '../../../component/TextName'
import tw from '../../../lib/tailwind'
import { Dirs, FileSystem } from 'react-native-file-access'
import { ConsoleWarn } from '../../../lib/Util'

//文件浏览界面
const DatabaseFileSelectScreen = (props) => {
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

  const importDB = async (path) => {
    let result = await FileSystem.exists(path)
    if (result) {
      // close and delete db
      props.avatar.get('AvatarDB').closeDB(true, props.avatar.get('Address'))
      // copy db
      let dest_file_path = `${Dirs.DatabaseDir}/${props.avatar.get('Address')}`
      result = await FileSystem.cp(path, dest_file_path)
      // exit
      props.dispatch({ type: actionType.avatar.disableAvatar, flag_clear_db: false })
    }
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      {
        <View style={tw`h-full`}>
          {
            Dirs.SDCardDir != props.route.params.dir &&
            <TouchableOpacity onPress={() => props.navigation.replace('DatabaseFileSelect', { dir: parentDir })} >
              <View style={tw`flex flex-row bg-stone-500 dark:bg-stone-300 p-5px mb-1px`}>
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
                      <TouchableOpacity key={index} onPress={() => importDB(item.path)} >
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
                      <TouchableOpacity key={index} onPress={() => props.navigation.replace('DatabaseFileSelect', { dir: item.path })} >
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

const ReduxDatabaseFileSelectScreen = connect((state) => {
  return {
    avatar: state.avatar,
    master: state.master
  }
})(DatabaseFileSelectScreen)

export default ReduxDatabaseFileSelectScreen