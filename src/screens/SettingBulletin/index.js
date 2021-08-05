import * as React from 'react';
import { View, Text, Button } from 'react-native';

import { connect } from 'react-redux'

import { actionType } from '../../redux/actions/actionType'

//设置
class SettingBulletinScreen extends React.Component {
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
        <Button title="我的公告" onPress={() => { this.props.navigation.push('BulletinList', { address: this.props.avatar.get('Address') }) }} />
        <Button title="我的收藏" onPress={() => { this.props.navigation.push('BulletinMark') }} />
      </View >
    )
  }
}

const ReduxSettingBulletinScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingBulletinScreen)

export default ReduxSettingBulletinScreen