import * as React from 'react';
import { View, Text, Button } from 'react-native';

import { connect } from 'react-redux'

import { actionType } from '../../redux/actions/actionType'

//设置
class TabSettingScreen extends React.Component {
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
        <Button title="我" onPress={() => { this.props.navigation.navigate('SettingMe') }} />
        <Button title="网络设置" onPress={() => { this.props.navigation.navigate('SettingNetwork') }} />
        <Button title="公告设置" onPress={() => { this.props.navigation.push('SettingBulletin') }} />
      </View >
    )
  }
}

const ReduxTabSettingScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabSettingScreen)

export default ReduxTabSettingScreen