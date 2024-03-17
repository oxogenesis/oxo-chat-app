import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { View, ToastAndroid } from 'react-native'
import { BulletinAddressSession } from '../../../lib/Const'
import Clipboard from '@react-native-clipboard/clipboard'
import { MasterConfig } from '../../../lib/OXO'
import LinkSetting from '../../../component/LinkSetting'
import SwitchSetting from '../../../component/SwitchSetting'
import ViewModal from '../../../component/ViewModal'
import ButtonPrimary from '../../../component/ButtonPrimary'
import QRCode from 'react-native-qrcode-svg'
import tw from '../../../lib/tailwind'

//设置
const SettingMeScreen = (props) => {

  const [visible, showModal] = useState(false)
  const [isMulti, setMulti] = useState()

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

  const onSwitchMulti = (multi) => {
    // multi:true false
    // address:true address
    let address = true
    if (!multi) {
      address = props.avatar.get('Address')
    }

    setMulti(multi)

    MasterConfig({ multi: address })
      .then(result => {
        if (result) {
          props.dispatch({
            type: actionType.master.setMulti,
            multi: address
          })
        } else {
        }
      })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      let multi = props.master.get("Multi")
      //not setMulti(multi)
      if (multi == true) {
        setMulti(true)
      } else {
        setMulti(false)
      }
    })
  })

  useEffect(() => {
    if (props.avatar.get('Database') == null) {
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
  }, [props.avatar])

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
      <View style={tw`h-5`}></View>
      <LinkSetting title={'我的公告'} onPress={() => {
        props.navigation.push('BulletinList', { session: BulletinAddressSession, address: props.avatar.get('Address') })
      }} />
      <LinkSetting title={props.avatar.get('Name')} icon={'edit'} onPress={() => {
        props.navigation.navigate('AvatarNameEdit')
      }} />
      <LinkSetting title={props.avatar.get('Address')} textSize={'text-sm'} icon={'copy1'} onPress={copyToClipboard} />
      <SwitchSetting title={'切换多账号模式'} checked={isMulti} onChange={onSwitchMulti} />
      <LinkSetting title={'查看种子二维码'} onPress={viewSeedQrcodeAlert} />

      <View style={tw`my-5px px-25px`}>
        {
          isMulti ?
            <ButtonPrimary title='切换账户' bg='bg-indigo-500' onPress={() => { props.dispatch({ type: actionType.avatar.disableAvatar, flag_clear_db: false }) }} />
            :
            <ButtonPrimary title='安全退出' bg='bg-red-500' onPress={() => { props.dispatch({ type: actionType.avatar.disableAvatar, flag_clear_db: false }) }} />
        }
      </View >

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
    </View >
  )
}

const ReduxSettingMeScreen = connect((state) => {
  return {
    avatar: state.avatar,
    master: state.master
  }
})(SettingMeScreen)

export default ReduxSettingMeScreen