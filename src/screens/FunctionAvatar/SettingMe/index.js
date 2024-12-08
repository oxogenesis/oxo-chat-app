import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { View, ToastAndroid, ScrollView } from 'react-native'
import { BulletinAddressSession } from '../../../lib/Const'
import ImagePicker from 'react-native-image-crop-picker'
import { Dirs, FileSystem } from 'react-native-file-access'
import Clipboard from '@react-native-clipboard/clipboard'
import LinkSetting from '../../../component/LinkSetting'
import ViewModal from '../../../component/ViewModal'
import QRCode from 'react-native-qrcode-svg'
import tw from '../../../lib/tailwind'
import { ConsoleWarn } from '../../../lib/Util'

//设置
const SettingMeScreen = (props) => {

  const [avatarImg, setAvatarImg] = useState(null)
  const [visible, showModal] = useState(false)

  const json = {
    "Relay": props.avatar.get('CurrentHost'),
    "PublicKey": props.avatar.get('PublicKey')
  }
  const [qrcode, setQrcode] = useState(JSON.stringify(json))

  const copyToClipboard = () => {
    ToastAndroid.show('拷贝成功！',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
    Clipboard.setString(props.avatar.get('Address'))
  }

  const viewSeedQrcodeAlert = () => {
    showModal(true)
  }

  const onClose = () => {
    showModal(false)
  }

  const picker = async () => {
    let address = props.avatar.get('Address')
    let avatar_img_dir = `${Dirs.DocumentDir}/AvatarImg`
    let avatar_img_path = `${avatar_img_dir}/${address}`
    let image = await ImagePicker.openPicker({
      width: 50,
      height: 50,
      cropping: true,
      includeBase64: true
    }).catch(e => {
      ConsoleWarn(e)
      ConsoleWarn(e.code)
    })
    if (image) {
      if (image.mime != 'image/png') {
      }
      let result = await FileSystem.exists(avatar_img_dir)
      if (!result) {
        result = await FileSystem.mkdir(avatar_img_dir)
      }
      result = await FileSystem.exists(avatar_img_path)
      if (result) {
        await FileSystem.unlink(avatar_img_path)
      }
      // await FileSystem.mv(image_file_path, avatar_img_path)
      let content = `data:${image.mime};base64,${image.data}`
      setAvatarImg(content)
      // await FileSystem.writeFile(avatar_img_path, content, 'utf8')
      props.dispatch({
        type: actionType.master.updateAvatarImage,
        address: address,
        image: content
      })
    }
  }

  const loadAvatar = async () => {
    // let address = props.avatar.get('Address')
    // let avatar_img_dir = `${Dirs.DocumentDir}/AvatarImg`
    // let avatar_img_path = `${avatar_img_dir}/${address}`
    // let result = await FileSystem.exists(avatar_img_path)
    // if (result) {
    //   result = await FileSystem.readFile(avatar_img_path, 'utf8')
    //   setAvatarImg(result)
    // }
    let avatar_image = props.master.get("AvatarImage")
    if (avatar_image[props.avatar.get('Address')]) {
      setAvatarImg(avatar_image[props.avatar.get('Address')])
    }
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      loadAvatar()
    })
  })

  return (
    <ScrollView style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`items-center bg-neutral-100 dark:bg-neutral-600 p-32px`}>
        {
          avatarImg != null ?
            <QRCode
              value={qrcode}
              size={350}
              logo={avatarImg}
              logoSize={50}
              backgroundColor={tw.color(`neutral-200 dark:neutral-800`)}
              color={tw.color(`neutral-800 dark:neutral-200`)}
              logoBackgroundColor='grey'
            />
            :
            <QRCode
              value={qrcode}
              size={350}
              logo={require('../../../assets/app.png')}
              logoSize={50}
              backgroundColor={tw.color(`neutral-200 dark:neutral-800`)}
              color={tw.color(`neutral-800 dark:neutral-200`)}
              logoBackgroundColor='grey'
            />
        }
      </View>
      <View style={tw`h-5`}></View>
      <LinkSetting title={'我的公告'} onPress={() => {
        props.navigation.push('BulletinList', { session: BulletinAddressSession, address: props.avatar.get('Address') })
      }} />
      <LinkSetting title={'我的头像'} icon={'edit'} onPress={picker} />
      <LinkSetting title={props.avatar.get('Name')} icon={'edit'} onPress={() => {
        props.navigation.navigate('AvatarNameEdit')
      }} />
      <LinkSetting title={props.avatar.get('Address')} textSize={'text-sm'} icon={'copy1'} onPress={copyToClipboard} />
      <LinkSetting title={'查看种子二维码'} onPress={viewSeedQrcodeAlert} />

      <ViewModal
        visible={visible}
        onClose={onClose}
        msg='确保在私密环境下，通过可信设备扫描种子二维码，迁移种子。
        确定要查看种子二维码？'
        onConfirm={() => {
          showModal(false)
          props.navigation.navigate('AvatarSeedQrcode')
        }}
      />
    </ScrollView >
  )
}

const ReduxSettingMeScreen = connect((state) => {
  return {
    avatar: state.avatar,
    master: state.master
  }
})(SettingMeScreen)

export default ReduxSettingMeScreen