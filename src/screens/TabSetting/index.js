import * as React from 'react'
import { View, Text, Button } from 'react-native'

import { connect } from 'react-redux'

import { actionType } from '../../redux/actions/actionType'
import { my_styles } from '../../theme/style'

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
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <View style={my_styles.TabSheet}>
        <Button title="我" onPress={() => { this.props.navigation.navigate('SettingMe') }} />
        <Button title="网络设置" onPress={() => { this.props.navigation.navigate('SettingNetwork') }} />
        <Button title="公告设置" onPress={() => { this.props.navigation.navigate('SettingBulletin') }} />
        <Button title="地址管理" onPress={() => { this.props.navigation.navigate('SettingAddress') }} />
        <Button color="orange" title="切换账户" onPress={() => {
          this.props.dispatch({
            type: actionType.avatar.disableAvatar
          })
          this.props.navigation.navigate('AvatarList')
        }} />
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