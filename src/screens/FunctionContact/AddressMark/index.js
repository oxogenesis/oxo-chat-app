import React, { useState, useEffect } from 'react'
import { View, ScrollView, ToastAndroid } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import ImagePicker from 'react-native-image-crop-picker'
import QRCode from 'react-native-qrcode-svg'
import { BulletinAddressSession } from '../../../lib/Const'
import Clipboard from '@react-native-clipboard/clipboard'
import ViewModal from '../../../component/ViewModal'
import LinkSetting from '../../../component/LinkSetting'
import SwitchSetting from '../../../component/SwitchSetting'
import ButtonPrimary from '../../../component/ButtonPrimary'
import { AddressToName, ConsoleInfo, ConsoleWarn } from '../../../lib/Util'
import tw from '../../../lib/tailwind'

//地址标记
const AddressMarkScreen = (props) => {
  const [current, setCurrent] = useState(undefined)
  const [visible_delete, show_visible_delete] = useState(false)
  const [visible_del_friend, show_visible_del_friend] = useState(false)
  const [visible_del_follow, show_visible_del_follow] = useState(false)

  const [avatarImg, setAvatarImg] = useState(null)
  const [qrcode, setQrcode] = useState('')

  const picker = async () => {
    let image = await ImagePicker.openPicker({
      width: 50,
      height: 50,
      cropping: true,
      includeBase64: true
    })
    if (image) {
      let content = `data:${image.mime};base64,${image.data}`
      setAvatarImg(content)
      props.dispatch({
        type: actionType.master.updateAvatarImage,
        address: props.route.params.address,
        image: content
      })
    }
  }

  const delAddressMark = () => {
    if (current.IsFollow || current.IsFriend) {
      show_visible_delete(true)
    } else {
      props.dispatch({
        type: actionType.avatar.delAddressMark,
        address: props.route.params.address
      })
      props.navigation.goBack()
    }
  }

  const onClose = () => {
    show_visible_delete(false)
    show_visible_del_friend(false)
    show_visible_del_follow(false)
  }

  const addFriend = () => {
    props.dispatch({
      type: actionType.avatar.addFriend,
      address: props.route.params.address
    })
  }

  const delFriend = () => {
    setFriend(false)
    show_visible_del_friend(false)
    props.dispatch({
      type: actionType.avatar.delFriend,
      address: props.route.params.address
    })
  }

  const addFollow = () => {
    props.dispatch({
      type: actionType.avatar.addFollow,
      address: props.route.params.address
    })

    props.dispatch({
      type: actionType.avatar.FetchBulletin,
      address: props.route.params.address,
      sequence: 1,
      to: props.route.params.address
    })
  }

  const delFollow = () => {
    setFollow(false)
    show_visible_del_follow(false)
    props.dispatch({
      type: actionType.avatar.delFollow,
      address: props.route.params.address
    })
  }

  useEffect(() => {
    if (props.avatar.get('CurrentAddressMark')) {
      setCurrent(props.avatar.get('CurrentAddressMark'))

      let json = {
        Relay: props.avatar.get('CurrentHost'),
        Address: props.route.params.address
      }
      setQrcode(JSON.stringify(json))
    }
  }, [props.avatar])

  const loadAddressMark = () => {
    props.dispatch({
      type: actionType.avatar.setCurrentAddressMark,
      address: props.route.params.address
    })
  }

  const copyToClipboard = () => {
    Clipboard.setString(props.route.params.address)
    ToastAndroid.show('拷贝成功！',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      if (props.avatar.get('Address') == props.route.params.address) {
        props.navigation.replace('SettingMe')
      } else if (props.avatar.get('AddressMap')[props.route.params.address] == null) {
        props.navigation.replace('AddressAdd', { address: props.route.params.address })
      } else {
        loadAddressMark()
        let avatar_image = props.master.get("AvatarImage")
        if (avatar_image[props.avatar.get('Address')]) {
          setAvatarImg(avatar_image[props.avatar.get('Address')])
        }
      }
    })
  })

  const onSwitchChangeFollow = async value => {
    if (value) {
      await addFollow()
      setFollow(value)
    } else {
      show_visible_del_follow(true)
    }
  }

  const onSwitchChangeFriend = async value => {
    if (value) {
      await addFriend()
      setFriend(value)
    } else {
      show_visible_del_friend(true)
    }
  }

  return (
    <ScrollView style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      {
        current &&
        <>
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
          <LinkSetting title={AddressToName(props.avatar.get('AddressMap'), props.route.params.address)} icon={'edit'} onPress={() => {
            props.navigation.navigate('AddressEdit', { address: props.route.params.address })
          }} />
          <LinkSetting title={props.route.params.address} textSize={'text-sm'} icon={'copy1'} onPress={copyToClipboard} />
          <LinkSetting title={'编辑头像'} icon={'edit'} onPress={picker} />
          <SwitchSetting title={'关注公告'} checked={current.IsFollow} onChange={onSwitchChangeFollow} />
          <SwitchSetting title={'添加好友'} checked={current.IsFriend} onChange={onSwitchChangeFriend} />

          <View style={tw`my-5px px-25px`}>
            {
              current.IsFollow &&
              <ButtonPrimary title='查看公告' bg='bg-green-500' onPress={() => props.navigation.push('BulletinList', { session: BulletinAddressSession, address: props.route.params.address })} />
            }

            {
              current.IsFriend &&
              <ButtonPrimary title='开始聊天' bg='bg-green-500' onPress={() => props.navigation.push('Session', { address: props.route.params.address })} />
            }

            <ButtonPrimary title='删除' bg='bg-red-500' onPress={delAddressMark} />
          </View>
        </>
      }
      <ViewModal
        visible={visible_del_follow}
        onClose={onClose}
        msg="取消关注账户后，该账户的公告都将会被设置为缓存。"
        onConfirm={delFollow}
      />
      <ViewModal
        visible={visible_del_friend}
        onClose={onClose}
        msg='解除好友关系后，历史聊天记录将会被删除，并拒绝接收该账户的消息。'
        onConfirm={delFriend}
      />
      <ViewModal
        visible={visible_delete}
        title={'错误'}
        msg={'删除账户标记前，请先解除好友并取消关注，谢谢。'}
        onClose={onClose}
        onConfirm={onClose}
      />
    </ScrollView>
  )
}

const ReduxAddressMarkScreen = connect((state) => {
  return {
    master: state.master,
    avatar: state.avatar
  }
})(AddressMarkScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAddressMarkScreen{...props} navigation={navigation} route={route} />
}