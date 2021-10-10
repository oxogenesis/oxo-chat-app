import * as React from 'react'
import { View, Text, Button, Alert, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { BulletinAddressSession } from '../../lib/Const'
import Clipboard from '@react-native-clipboard/clipboard'

//地址标记
class AddressMarkScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  delAddressMark() {
    if (this.props.avatar.get('CurrentAddressMark').IsFollow || this.props.avatar.get('CurrentAddressMark').IsFriend) {
      Alert.alert(
        '错误',
        '删除账户标记前，请先解除好友并取消关注，谢谢。',
        [
          { text: '确认', style: 'cancel' }
        ],
        { cancelable: false }
      )
    } else {
      this.props.dispatch({
        type: actionType.avatar.delAddressMark,
        address: this.props.avatar.get('CurrentAddressMark').Address
      })
      this.props.navigation.goBack()
    }
  }

  addFriend() {
    this.props.dispatch({
      type: actionType.avatar.addFriend,
      address: this.props.avatar.get('CurrentAddressMark').Address
    })
  }

  delFriendAlert() {
    Alert.alert(
      '提示',
      '解除好友关系后，历史聊天记录将会被删除，并拒绝接收该账户的消息。',
      [
        { text: '确认', onPress: () => this.delFriend() },
        { text: '取消', style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

  delFriend() {
    this.props.dispatch({
      type: actionType.avatar.delFriend,
      address: this.props.avatar.get('CurrentAddressMark').Address
    })
  }

  addFollow() {
    this.props.dispatch({
      type: actionType.avatar.addFollow,
      address: this.props.avatar.get('CurrentAddressMark').Address
    })
  }

  delFollowAlert() {
    Alert.alert(
      '提示',
      '取消关注账户后，该账户的公告都将会被设置为缓存。',
      [
        { text: '确认', onPress: () => this.delFollow() },
        { text: '取消', style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

  delFollow() {
    this.props.dispatch({
      type: actionType.avatar.delFollow,
      address: this.props.avatar.get('CurrentAddressMark').Address
    })
  }

  loadAddressMark() {
    this.props.dispatch({
      type: actionType.avatar.setCurrentAddressMark,
      address: this.props.route.params.address
    })
  }

  copyToClipboard(content) {
    Clipboard.setString(content)
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadAddressMark()
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <>
        {
          this.props.avatar.get('CurrentAddressMark') &&
          <View>
            <TouchableOpacity onPress={() => { this.copyToClipboard(this.props.avatar.get('CurrentAddressMark').Address) }}>
              <Text style={{ color: 'blue', fontWeight: 'bold' }}>
                {this.props.avatar.get('CurrentAddressMark').Address}
              </Text>
            </TouchableOpacity>
            {
              this.props.avatar.get('CurrentAddressMark').IsMark ?
                <>
                  <Text style={{ color: 'blue', fontWeight: 'bold' }}>
                    {this.props.avatar.get('CurrentAddressMark').Name}
                  </Text>
                  <Button
                    title="修改昵称"
                    onPress={() => this.props.navigation.navigate('AddressEdit', { address: this.props.avatar.get('CurrentAddressMark').Address })} />
                  <Button color='red' title="删除" onPress={() => this.delAddressMark()} />

                  {
                    this.props.avatar.get('CurrentAddressMark').IsFriend ?
                      <>
                        <Button title="开始聊天" onPress={() =>
                          this.props.navigation.push('Session', { address: this.props.avatar.get('CurrentAddressMark').Address })} />
                        <Button color='orange' title="解除好友" onPress={() => this.delFriend()} />
                      </>
                      :
                      <Button title="加为好友" onPress={() => this.addFriend()} />
                  }
                  {
                    this.props.avatar.get('CurrentAddressMark').IsFollow ?
                      <>
                        <Button title="查看公告" onPress={() =>
                          this.props.navigation.push('BulletinList', { session: BulletinAddressSession, address: this.props.avatar.get('CurrentAddressMark').Address })} />
                        <Button color='orange' title="取消关注" onPress={() => this.delFollowAlert()} />
                      </>
                      :
                      <Button title="关注公告" onPress={() => this.addFollow()} />
                  }
                </>
                :
                <>
                  <Button
                    title="标记地址"
                    onPress={() => this.props.navigation.navigate('AddressAdd', { address: this.props.avatar.get('CurrentAddressMark').Address })} />
                </>
            }
          </View>
        }
      </>
    )
  }
}

const ReduxAddressMarkScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressMarkScreen)

//export default AddressMarkScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAddressMarkScreen{...props} navigation={navigation} route={route} />
}