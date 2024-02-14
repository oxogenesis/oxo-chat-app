import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { BulletinAddressSession } from '../../../lib/Const'
import Clipboard from '@react-native-clipboard/clipboard'
import { Button, Toast } from '@ant-design/react-native'
import ViewAlert from '../../../component/ViewAlert'
import LinkSetting from '../../../component/LinkSetting'
import SwitchSetting from '../../../component/SwitchSetting'
import { AddressToName } from '../../../lib/Util'
import tw from '../../../lib/tailwind'

//地址标记
const AddressMarkScreen = (props) => {
  const [isFriend, setFriend] = useState(undefined)
  const [isFollow, setFollow] = useState(undefined)
  const [visible_delete, show_visible_delete] = useState(false)
  const [visible_del_friend, show_visible_del_friend] = useState(false)
  const [visible_del_follow, show_visible_del_follow] = useState(false)

  const delAddressMark = () => {
    if (props.avatar.get('CurrentAddressMark').IsFollow || props.avatar.get('CurrentAddressMark').IsFriend) {
      show_visible_delete(true)
    } else {
      props.dispatch({
        type: actionType.avatar.delAddressMark,
        address: props.avatar.get('CurrentAddressMark').Address
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
      address: props.avatar.get('CurrentAddressMark').Address
    })
  }

  const delFriend = () => {
    setFriend(false)
    props.dispatch({
      type: actionType.avatar.delFriend,
      address: props.avatar.get('CurrentAddressMark').Address
    })
  }

  const addFollow = () => {
    props.dispatch({
      type: actionType.avatar.addFollow,
      address: props.avatar.get('CurrentAddressMark').Address
    })
  }

  const delFollow = () => {
    setFollow(false)
    props.dispatch({
      type: actionType.avatar.delFollow,
      address: props.avatar.get('CurrentAddressMark').Address
    })
  }

  const loadAddressMark = () => {
    props.dispatch({
      type: actionType.avatar.setCurrentAddressMark,
      address: props.route.params.address
    })
  }

  const copyToClipboard = () => {
    Clipboard.setString(props.avatar.get('CurrentAddressMark').Address)
    Toast.success('拷贝成功！', 1)
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      if (props.avatar.get('Address') == props.route.params.address) {
        props.navigation.replace('SettingMe')
      } else if (props.avatar.get('AddressMap')[props.route.params.address] == null) {
        props.navigation.replace('AddressAdd', { address: props.route.params.address })
      } else {
        loadAddressMark()
      }
    })
  })

  const onSwitchChangeFollow = async value => {
    console.log(value)
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

  const current = props.avatar.get('CurrentAddressMark')
  const { Address, IsFriend, IsFollow } = current || {}
  const currentFriend = isFriend === undefined ? IsFriend : isFriend
  const currentFollow = isFollow === undefined ? IsFollow : isFollow

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      {
        current &&
        <>
          <LinkSetting title={AddressToName(props.avatar.get('AddressMap'), Address)} icon={'edit'} onPress={() => {
            props.navigation.navigate('AddressEdit', { address: Address })
          }} />
          <LinkSetting title={Address} textSize={'text-sm'} icon={'block'} onPress={copyToClipboard} />
          <SwitchSetting title={'关注公告'} checked={currentFollow} onChange={onSwitchChangeFollow} />
          <SwitchSetting title={'添加好友'} checked={currentFriend} onChange={onSwitchChangeFriend} />

          <View style={tw`my-5px px-25px`}>
            {
              currentFollow &&
              <Button style={tw`rounded-full bg-green-500`} onPress={() =>
                props.navigation.push('BulletinList', { session: BulletinAddressSession, address: Address })}>
                <Text style={tw`text-lg text-slate-100`}>查看公告</Text>
              </Button>
            }

            {
              currentFriend &&
              <Button style={tw`rounded-full bg-green-500`} onPress={() =>
                props.navigation.push('Session', { address: Address })}>
                <Text style={tw`text-lg text-slate-100`}>开始聊天</Text>
              </Button>
            }

            <Button style={tw`rounded-full bg-red-500`} onPress={delAddressMark}>
              <Text style={tw`text-lg text-slate-100`}>删除</Text>
            </Button>
          </View>
        </>
      }
      <ViewAlert
        visible={visible_delete}
        onPress={onClose}
        onClose={onClose}
        title='错误'
        msg='删除账户标记前，请先解除好友并取消关注，谢谢。'
      />
      <ViewAlert
        visible={visible_del_follow}
        onClose={onClose}
        msg="取消关注账户后，该账户的公告都将会被设置为缓存。"
        onPress={delFollow}
      />
      <ViewAlert
        visible={visible_del_friend}
        onClose={onClose}
        msg='解除好友关系后，历史聊天记录将会被删除，并拒绝接收该账户的消息。'
        onPress={delFriend}
      />
    </View>
  )

}

const ReduxAddressMarkScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressMarkScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAddressMarkScreen{...props} navigation={navigation} route={route} />
}