import * as React from 'react'
import { View, Text, Button, Alert, TextInput } from 'react-native'

import QRCode from 'react-native-qrcode-svg'

import { connect } from 'react-redux'

import { actionType } from '../../redux/actions/actionType'
import { my_styles } from '../../theme/style'

//设置
class SettingAddressScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: this.props.avatar.get('Address'),
      name: this.props.avatar.get('name')
    }
  }

  loadState() {
    this.setState({
      address: this.props.avatar.get('Address'),
      name: this.props.avatar.get('Name')
    })
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadState()
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <View>
        <Button title="好友管理" onPress={() => { this.props.navigation.navigate('SettingFriend') }} />
        <Button color="orange" title="好友申请" onPress={() => { this.props.navigation.navigate('SettingFriendRequest') }} />
        <Button title="关注管理" onPress={() => { this.props.navigation.navigate('SettingFollow') }} />
      </View >
    )
  }
}

const ReduxSettingAddressScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingAddressScreen)

export default ReduxSettingAddressScreen