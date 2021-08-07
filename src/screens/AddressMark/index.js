import * as React from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { BulletinAddressSession } from '../../lib/Const'

//地址标记
class AddressMarkScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  delAddressMark() {
    if (this.props.avatar.get('CurrentAddressMark').IsFollow || this.props.avatar.get('CurrentAddressMark').IsFriend) {
      console.log(`...`)
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
            <Text>地址: {this.props.avatar.get('CurrentAddressMark').Address}</Text>
            <Text>昵称: {this.props.avatar.get('CurrentAddressMark').Name}</Text>
            {
              this.props.avatar.get('CurrentAddressMark').IsMark ?
                <>
                  <Button
                    title="修改昵称"
                    onPress={() => this.props.navigation.navigate('AddressEdit', { address: this.props.avatar.get('CurrentAddressMark').Address })} />
                  <Button color='red' title="删除" onPress={() => this.delAddressMark()} />
                </>
                :
                <>
                  <Button
                    title="标记地址"
                    onPress={() => this.props.navigation.navigate('AddressAdd', { address: this.props.avatar.get('CurrentAddressMark').Address })} />
                </>
            }
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
                  <Button color='orange' title="取消关注" onPress={() => this.delFollow()} />
                </>
                :
                <Button title="关注公告" onPress={() => this.addFollow()} />
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