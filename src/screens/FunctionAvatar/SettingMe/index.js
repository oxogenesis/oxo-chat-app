import React, { useState } from 'react'
import { View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { connect } from 'react-redux'
import { BulletinAddressSession } from '../../../lib/Const'
import Clipboard from '@react-native-clipboard/clipboard'
import { Toast } from '@ant-design/react-native'
import { WhiteSpace } from '@ant-design/react-native'
import LinkSetting from '../../../component/LinkSetting'
import ViewAlert from '../../../component/ViewAlert'
import tw from '../../../lib/tailwind'

//设置
const SettingMeScreen = (props) => {

  const [visible, showModal] = useState(false)

  const json = {
    "Relay": props.avatar.get('CurrentHost'),
    "PublicKey": props.avatar.get('PublicKey')
  }
  const [qrcode, setQrcode] = useState(JSON.stringify(json))

  const copyToClipboard = () => {
    Toast.success('拷贝成功！', 1)
    Clipboard.setString(props.avatar.get('Address'))
  }

  const viewSeedQrcodeAlert = () => {
    showModal(true)
  }

  const onClose = () => {
    showModal(false)
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`items-center bg-neutral-100 dark:bg-neutral-600 p-32px`}>
        <QRCode
          value={qrcode}
          size={350}
          logo={require('../../../assets/app.png')}
          logoSize={50}
          backgroundColor={tw.color(`neutral-200 dark:neutral-800`)}
          color={tw.color(`neutral-800 dark:neutral-200`)}
          logoBackgroundColor='grey'
        />
      </View>
      <WhiteSpace size='lg' />
      <LinkSetting title={'我的公告'} onPress={() => {
        props.navigation.push('BulletinList', { session: BulletinAddressSession, address: props.avatar.get('Address') })
      }} />
      <LinkSetting title={props.avatar.get('Name')} icon={'edit'}  onPress={() => {
        props.navigation.navigate('AvatarNameEdit')
      }} />
      <LinkSetting title={props.avatar.get('Address')} textSize={'text-sm'} icon={'block'} onPress={copyToClipboard} />
      <LinkSetting title={'查看种子二维码'} onPress={viewSeedQrcodeAlert} />

      <ViewAlert
        visible={visible}
        onClose={onClose}
        msg='确保在私密环境下，通过可信设备扫描种子二维码，迁移种子。
        确定要查看种子二维码？'
        onPress={() => props.navigation.navigate('AvatarSeedQrcode')}
      />
    </View >
  )
}

const ReduxSettingMeScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingMeScreen)

export default ReduxSettingMeScreen