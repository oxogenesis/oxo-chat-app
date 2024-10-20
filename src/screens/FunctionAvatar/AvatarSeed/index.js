import React, { useState } from 'react'
import { View, Text, ToastAndroid, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { AvatarRemove } from '../../../lib/OXO'
import Clipboard from '@react-native-clipboard/clipboard'
import ViewModal from '../../../component/ViewModal'
import ButtonPrimary from '../../../component/ButtonPrimary'
import tw from '../../../lib/tailwind'
import { Dirs, FileSystem } from 'react-native-file-access'
import { ConsoleWarn, timestamp2Number } from '../../../lib/Util'

// 查看种子
const AvatarSeedScreen = (props) => {
  const seed = props.avatar.get('Seed')
  const [visible_copy_seed, showCopySeed] = useState(false)
  const [visible_remove_account, showRemoveAvatar] = useState(false)

  const copyToClipboard = () => {
    ToastAndroid.show('拷贝成功！',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
    Clipboard.setString(seed)
    showCopySeed(false)
  }

  const copySeedAlert = () => {
    showCopySeed(true)
  }

  const viewRemoveAvatar = () => {
    showRemoveAvatar(true)
  }

  const onClose = () => {
    showCopySeed(false)
    showRemoveAvatar(false)
  }

  const removeAvatar = () => {
    AvatarRemove(props.avatar.get('Address'))
      .then((result) => {
        if (result) {
          props.dispatch({
            type: actionType.avatar.disableAvatar,
            flag_clear_db: true
          })
          if (props.master.get("Multi") == true) {
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'AvatarList' }],
            })
          } else {
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'Unlock' }],
            })
          }
        }
        showRemoveAvatar(false)
      })
  }

  const backupDB = async () => {
    let timestamp = timestamp2Number(Date.now())

    let sour_file_path = `${Dirs.DatabaseDir}/${props.avatar.get('Address')}`
    let dest_file_path = `${Dirs.SDCardDir}/Download/oxo.${props.avatar.get('Address')}.${timestamp}.db`
    result = await FileSystem.cp(sour_file_path, dest_file_path)
    ToastAndroid.show(`文件已复制到${dest_file_path}`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
  }

  const selectDB = async () => {
    props.navigation.push('DatabaseFileSelect', { dir: Dirs.SDCardDir })
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`px-25px`}>
        <TouchableOpacity onPress={() => { copySeedAlert() }}>
          <View style={tw`bg-neutral-100 dark:bg-neutral-600 rounded-lg px-1 border-2 border-gray-300 dark:border-gray-700 flex flex-row justify-between py-5px px-15px`}>
            <Text style={tw`text-base text-red-500`}>
              {props.avatar.get('Seed')}
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={tw`text-base text-neutral-500`}>
          {`注意：查看种子，应回避具备视觉的生物或设备，应在私密可控环境下。`}
        </Text>
        <ButtonPrimary title='删除账号' bg='bg-red-500' onPress={() => viewRemoveAvatar()} />
        <ButtonPrimary title='备份数据' bg='bg-green-500' onPress={() => backupDB()} />
        <ButtonPrimary title='加载数据' bg='bg-green-500' onPress={() => selectDB()} />
      </View>

      <ViewModal
        visible={visible_copy_seed}
        msg={'确定要复制种子吗？'}
        onClose={onClose}
        onConfirm={copyToClipboard}
      />
      <ViewModal
        visible={visible_remove_account}
        onClose={onClose}
        msg={`！！！种子是账号的唯一凭证，只存储在本地，服务器不提供找回功能！！！
！！！移除账号前，请务必备份种子！！！
确定要移除账号吗？`}
        onConfirm={() => removeAvatar()}
      />
    </View>
  )
}

const ReduxAvatarSeedScreen = connect((state) => {
  return {
    avatar: state.avatar,
    master: state.master
  }
})(AvatarSeedScreen)

export default ReduxAvatarSeedScreen