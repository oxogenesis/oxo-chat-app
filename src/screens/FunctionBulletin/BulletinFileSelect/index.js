import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { FileMaxSize, BulletinFileExtRegex } from '../../../lib/Const'
import ViewEmpty from '../../../component/ViewEmpty'
import TextTimestamp from '../../../component/TextTimestamp'
import TextFileSize from '../../../component/TextFileSize'
import TextName from '../../../component/TextName'
import tw from '../../../lib/tailwind'
import { Dirs, FileSystem } from 'react-native-file-access'
import DirUpLevel from '../../../component/DirUpLevel'

//文件浏览界面
const BulletinFileSelectScreen = (props) => {
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
      let filename = stat.filename.split('.')

      if (stat.size > FileMaxSize) {
        ToastAndroid.show(`文件大小不能超过1MB...`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER)
        return
      }
      if (!filename[1] || !BulletinFileExtRegex.test(filename[1])) {
        ToastAndroid.show(`文件格式只能是jpg、png、jpeg或者txt、md...`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER)
        return
      }

      let file_hash = await FileSystem.hash(path, 'SHA-1')
      file_hash = file_hash.toUpperCase()

      let file_json = { "Name": filename[0], "Ext": filename[1].toLowerCase(), "Size": stat.size, "Hash": file_hash }
      let bulletin_file_path = `${Dirs.DocumentDir}/BulletinFile/${props.avatar.get('Address')}/${file_hash}`
      result = await FileSystem.exists(bulletin_file_path)
      if (result) {
        result = await FileSystem.unlink(bulletin_file_path)
      }
      result = await FileSystem.cp(path, bulletin_file_path)

      props.dispatch({
        type: actionType.avatar.addFileList,
        file_json: file_json
      })
      props.dispatch({
        type: actionType.avatar.CacheLocalBulletinFile,
        file_json: file_json
      })

      // props.navigation.replace('BulletinPublish', { file_json: file_json })
      props.navigation.push('BulletinPublish')
      // props.navigation.goBack()

      // let fileChunk = Math.ceil(stat.size / FileChunkSize)
      // for (let i = 0; i < fileChunk; i++) {
      //   result = await FileSystem.readFileChunk(path, i * FileChunkSize, FileChunkSize, 'utf8')
      //   // if (i == 0) {
      //   //   await FileSystem.writeFile(bulletin_file_path, result, 'utf8')
      //   // } else {
      //   await FileSystem.appendFile(bulletin_file_path, result, 'utf8')
      //   // }
      // }
      // file_hash = await FileSystem.hash(bulletin_file_path, 'SHA-1')
    }
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      {
        <View style={tw`h-full`}>
          {
            Dirs.SDCardDir != props.route.params.dir &&
            <DirUpLevel onPress={() => props.navigation.replace('BulletinFileSelect', { dir: parentDir })} />
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
                      <TouchableOpacity key={index} onPress={() => props.navigation.replace('BulletinFileSelect', { dir: item.path })} >
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

const ReduxBulletinFileSelectScreen = connect((state) => {
  return {
    avatar: state.avatar,
    master: state.master
  }
})(BulletinFileSelectScreen)

export default ReduxBulletinFileSelectScreen