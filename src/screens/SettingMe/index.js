import * as React from 'react'
import { View, Text, Button, Alert, TouchableOpacity } from 'react-native'

import QRCode from 'react-native-qrcode-svg'

import { connect } from 'react-redux'

import { actionType } from '../../redux/actions/actionType'
import Clipboard from '@react-native-clipboard/clipboard'

//设置
class SettingMeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: this.props.avatar.get('Address'),
      name: this.props.avatar.get('name'),
      qrcode: "xxx"
    }
  }

  copyToClipboard() {
    Clipboard.setString(this.state.address)
  }

  viewSeedQrcodeAlert() {
    Alert.alert(
      '提示',
      `确保在私密环境下，通过可信设备扫描种子二维码，迁移种子。
确定要查看种子二维码吗？`,
      [
        { text: '确认', onPress: () => this.props.navigation.navigate('AvatarSeedQrcode') },
        { text: '取消', style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

  loadFromDB() {
    this.props.dispatch({
      type: actionType.avatar.loadFromDB
    })
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      let json = { "Relay": this.props.avatar.get('CurrentHost'), "PublicKey": this.props.avatar.get('PublicKey') }
      this.setState({
        address: this.props.avatar.get('Address'),
        name: this.props.avatar.get('Name'),
        qrcode: JSON.stringify(json)
      })
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={() => { this.copyToClipboard() }}>
          <Text style={{ color: 'blue', fontWeight: 'bold' }}>
            {this.state.address}
          </Text>
        </TouchableOpacity>
        <Text style={{ color: 'blue', fontWeight: 'bold' }}>
          {this.state.name}
        </Text>
        <View style={{ alignItems: 'center' }}>
          <QRCode
            value={this.state.qrcode}
            size={350}
            logo={require('../../assets/app.png')}
            logoSize={50}
            logoBackgroundColor='grey'
          />
        </View>
        <Button title="修改昵称" onPress={() => { this.props.navigation.navigate('AvatarNameEdit') }} />
        <Button title="应用异常退出，导致数据显示：重载" onPress={() => { this.loadFromDB() }} />
        <Button color="red" title="查看种子二维码" onPress={() => { this.viewSeedQrcodeAlert() }} />
      </View >
    )
  }
}

const ReduxSettingMeScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingMeScreen)

export default ReduxSettingMeScreen