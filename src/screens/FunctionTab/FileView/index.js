import React, { useEffect, useState } from 'react'
import { View, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import { actionType } from '../../../redux/actions/actionType'
import { connect } from 'react-redux'
import tw from '../../../lib/tailwind'
import { FileSystem, Dirs } from 'react-native-file-access'
import BulletinContent from '../../../component/BulletinContent'
import ViewEmpty from '../../../component/ViewEmpty'

//文件查看
const FileViewScreen = (props) => {
  const [file, setFile] = useState(null)

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      loadFile()
    })
  })

  const loadFile = async () => {
    let address = props.route.params.address
    let hash = props.route.params.hash
    props.dispatch({
      type: actionType.avatar.LoadCurrentBulletinFile,
      address: address,
      hash: hash
    })

    let file_json = props.avatar.get('CurrentBulletinFile')
    console.log(`--------------------------------------------------------------------------------------loadFile`)
    if (file_json && file_json.chunk_length == file_json.chunk_cursor) {
      // file exist
      let file_path = `${Dirs.DocumentDir}/BulletinFile/${props.avatar.get('Address')}/${hash}`
      if (file_json.ext == 'txt') {
        // txt file
        file_json.content = await FileSystem.readFile(file_path, 'utf8')
      } else {
        // image file
        let result = await FileSystem.readFile(file_path, 'base64')
        file_json.image = `data:image/png;base64,${result}`
        // Image.getSize(file_json.image, (w, h) => {
        //   file_json.image_width = w
        //   file_json.image_height = h
        // })
        // console.log(`fileview--------------------------------------------------`)
      }
    } else {

    }
    console.log(file_json)
    setFile(file_json)

    // let file_path = `${Dirs.DocumentDir}/BulletinFile/${props.avatar.get('Address')}/${hash}`
    // console.log(file_path)

    // let result = await FileSystem.stat(file_path)
    // console.log(result)
    // result = await FileSystem.readFile(file_path, 'utf8')
    // console.log(result)
  }

  const saveFile = async () => {
    let dest_file_path = `${Dirs.SDCardDir}/Download/oxo.${file.name}.${file.ext}`
    await FileSystem.cp(`${Dirs.DocumentDir}/BulletinFile/${props.avatar.get('Address')}/${file.hash}`, dest_file_path)
    ToastAndroid.show(`文件已复制到${dest_file_path}`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
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
                    <Image
                      style={tw`h-full w-full border-2 border-gray-300 dark:border-gray-700`}
                      source={{ uri: file.image }}
                      resizeMode='stretch'>
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