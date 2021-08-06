import * as React from 'react'
import { View, Text, Button } from 'react-native'

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
        <Text>地址：{this.state.address}</Text>
        <Text>昵称：{this.state.name}</Text>
        <View style={{ alignItems: 'center' }}>
          <QRCode
            value={this.state.address}
            size={350}
            logo={require('../../assets/app.png')}
            logoSize={50}
            logoBackgroundColor='grey'
          />
        </View>
        <Button title="修改昵称" onPress={() => { this.props.navigation.push('AvatarNameEdit') }} />
        <Button color="red" title="查看种子" onPress={() => { this.props.navigation.push('AvatarSeed') }} />
        <Button title="切换账户" onPress={() => {
          this.props.dispatch({
            type: actionType.avatar.disableAvatar
          })
          this.props.navigation.navigate('AvatarList')
        }} />
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