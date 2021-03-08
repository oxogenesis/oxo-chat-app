import * as React from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType';
import { timestamp_format, AddressToName } from '../../lib/Util'

//地址标记
class AddressMarkScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: '', name: '', isFriend: false, isFollow: false }
  }

  deleteAddressMark() {

  }

  addFriend() {
    this.props.dispatch({
      type: actionType.avatar.addFriend,
      address: this.state.address
    })
  }

  delFriend() {
    this.props.dispatch({
      type: actionType.avatar.delFriend,
      address: this.state.address
    })
  }

  addFollow() {
    this.props.dispatch({
      type: actionType.avatar.addFollow,
      address: this.state.address
    })
  }

  delFollow() {
    this.props.dispatch({
      type: actionType.avatar.delFollow,
      address: this.state.address
    })
  }

  loadAddressMark() {
    this.setState({
      address: this.props.route.params.address,
      name: AddressToName(this.props.avatar.get('AddressMap'), this.props.route.params.address)
    })
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadAddressMark()
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    return (
      <View>
        <Text>name: {this.state.name}</Text>
        <Text>address: {this.state.address}</Text>
        <Button title="删除" onPress={() => this.deleteAddressMark()} />
        {
          this.props.avatar.get('Friends').includes(this.state.address) ?
            <>
              <Button title="聊天" onPress={() =>
                this.props.navigation.push('Session', { address: this.state.address })} />
              <Button title="解除好友" onPress={() => this.delFriend()} />
            </>
            :
            <Button title="加为好友-WTF" onPress={() => this.addFriend()} />
        }
        {
          this.props.avatar.get('Follows').includes(this.state.address) ?
            <>
              <Button title="公告" onPress={() =>
                this.props.navigation.push('BulletinList', { address: this.state.address })} />
              <Button title="取消关注" onPress={() => this.delFollow()} />
            </>
            :
            <Button title="关注-WTF" onPress={() => this.addFollow()} />
        }
      </View>
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