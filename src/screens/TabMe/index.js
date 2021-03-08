import * as React from 'react';
import { View, Text, Button } from 'react-native';

import QRCode from 'react-native-qrcode-svg';

import { connect } from 'react-redux'

import { actionType } from '../../redux/actions/actionType';

//设置
class TabMeScreen extends React.Component {
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
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    return (
      <View>
        <Text>{this.state.name}</Text>
        <Text>{this.state.address}</Text>
        <QRCode
          value={this.state.address}
          size={350}
          logo={require('../../assets/app.png')}
          logoSize={50}
          logoBackgroundColor='grey'
        />
        <Button title="切换账号" onPress={() => {
          this.props.dispatch({
            type: actionType.avatar.disableAvatar
          })
          this.props.navigation.navigate('AvatarList')
        }} />
        <Button title="网络设置" onPress={() => { this.props.navigation.navigate('Network') }} />
        <Button title="我的公告" onPress={() => { this.props.navigation.push('BulletinList', { address: this.props.avatar.get('Address') }) }} />
      </View >
    )
  }
}

const ReduxTabMeScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabMeScreen)

export default ReduxTabMeScreen