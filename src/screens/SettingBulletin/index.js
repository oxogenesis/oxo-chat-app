import * as React from 'react'
import { View, Text, Button } from 'react-native'

import { connect } from 'react-redux'
import { BulletinAddressSession, BulletinHistorySession, BulletinMarkSession } from '../../lib/Const'

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
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <View>
        <Button title="我的公告" onPress={() => { this.props.navigation.push('BulletinList', { session: BulletinAddressSession, address: this.props.avatar.get('Address') }) }} />
        <Button title="收藏公告" onPress={() => { this.props.navigation.push('BulletinList', { session: BulletinMarkSession }) }} />
        <Button title="浏览历史" onPress={() => { this.props.navigation.push('BulletinList', { session: BulletinHistorySession }) }} />
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