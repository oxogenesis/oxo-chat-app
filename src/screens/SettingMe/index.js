import * as React from 'react'
import { View, Text, Button, Alert, TextInput } from 'react-native'

import QRCode from 'react-native-qrcode-svg'

import { connect } from 'react-redux'

import { actionType } from '../../redux/actions/actionType'
import { my_styles } from '../../theme/style'

//设置
class SettingMeScreen extends React.Component {
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

  viewSeedAlert() {
    Alert.alert(
      '提示',
      `查看种子，应回避具备视觉的生物或设备，应在私密可控环境下。
确定要查看种子吗？`,
      [
        { text: '确认', onPress: () => this.props.navigation.navigate('AvatarSeed') },
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
      this.loadState()
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <View>
        <TextInput
          style={{ color: 'blue', fontWeight: 'bold' }}
          value={this.state.address}
          multiline={false}
        />
        <TextInput
          style={{ color: 'blue', fontWeight: 'bold' }}
          value={this.state.name}
          multiline={false}
        />
        <View style={{ alignItems: 'center' }}>
          <QRCode
            value={this.props.avatar.get('Qrcode')}
            size={350}
            logo={require('../../assets/app.png')}
            logoSize={50}
            logoBackgroundColor='grey'
          />
        </View>
        <Button title="修改昵称" onPress={() => { this.props.navigation.navigate('AvatarNameEdit') }} />
        <Button title="应用异常退出，导致数据显示：重载" onPress={() => { this.loadFromDB() }} />
        <Button color="red" title="查看种子" onPress={() => { this.viewSeedAlert() }} />
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