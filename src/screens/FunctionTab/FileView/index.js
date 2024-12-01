import React, { useEffect, useState } from 'react'
import { View, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import tw from '../../../lib/tailwind'
import { FileSystem, Dirs } from 'react-native-file-access'
import BulletinContent from '../../../component/BulletinContent'
import ViewEmpty from '../../../component/ViewEmpty'
import { ConsoleWarn } from '../../../lib/Util'

//文件查看
const FileViewScreen = (props) => {
  const [file, setFile] = useState(null)
  const [file_image, setFileImage] = useState(null)

  useEffect(() => {
    ConsoleWarn(`FileViewScreen`)
    if (props.avatar.get('CurrentBulletinFile') != null) {
      let file_json = props.avatar.get('CurrentBulletinFile')
      ConsoleWarn(file_json)
      loadFile(file_json)
    }
  }, [props.avatar])

  const loadFile = async (file_json) => {
    setFile(file_json)

    if (file_json.chunk_length == file_json.chunk_cursor) {
      // file exist
      let file_path = `${Dirs.DocumentDir}/BulletinFile/${props.avatar.get('Address')}/${file_json.hash}`
      if (file_json.ext == 'txt') {
        // txt file
        file_json.content = await FileSystem.readFile(file_path, 'utf8')
      } else {
        // image file
        setFileImage('file://' + file_path)
        // let result = await FileSystem.readFile(file_path, 'base64')
        // setFileImage(`data:image/png;base64,${result}`)
      }
    }

    // let file_path = `${Dirs.DocumentDir}/BulletinFile/${props.avatar.get('Address')}/${hash}`

    // let result = await FileSystem.stat(file_path)
    // result = await FileSystem.readFile(file_path, 'utf8')
  }

  const saveFile = async () => {
    let dest_file_dir = `${Dirs.SDCardDir}/Download/oxo`
    result = await FileSystem.mkdir(dest_file_dir)
    if (result) {
      let dest_file_path = `${dest_file_dir}/${file.name}.${file.ext}`
      await FileSystem.cp(`${Dirs.DocumentDir}/BulletinFile/${props.avatar.get('Address')}/${file.hash}`, dest_file_path)
      ToastAndroid.show(`文件已复制到${dest_file_path}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER)
    }
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      {
        file != null &&
        <View>
          {
            file.chunk_length == file.chunk_cursor ?
              <TouchableOpacity onPress={saveFile} >
                {
                  file.ext == 'txt' ?
                    <BulletinContent content={file.content} />
                    :
                    // TODO:better display
                    file_image != null &&
                    <Image
                      style={tw`h-full w-full border-2 border-gray-300 dark:border-gray-700`}
                      source={{ uri: file_image }}
                      resizeMode='repeat'>
                    </Image>
                }
              </TouchableOpacity>
              :
              <ViewEmpty msg={`获取中:${file.chunk_cursor}/${file.chunk_length}`} />
          }
        </View>
      }
    </View >
  )
}

const ReduxFileViewScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(FileViewScreen)

export default ReduxFileViewScreen