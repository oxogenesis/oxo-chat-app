import * as React from 'react'
import { Text, Button, TextInput } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { MasterKeySet } from '../../lib/OXO'

import { connect } from 'react-redux'

//主口令设置界面
class MasterKeyScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { masterKey: '', confirm: '', error_msg: '' }
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      try {
        AsyncStorage.getItem('<#MasterKey#>').then(result => {
          if (result != null) {
            this.props.navigation.navigate('Unlock')
          }
        })
      } catch (e) {
        console.log(e)
      }
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  setMasterKey() {
    if (this.state.masterKey != this.state.confirm) {
      this.setState({ error_msg: 'confirm not match...' })
      return
    } else if (this.state.masterKey.trim() == '') {
      this.setState({ error_msg: 'MasterKey could not be null...' })
      return
    }

    MasterKeySet(this.state.masterKey).then(result => {
      if (result) {
        this.setState({ masterKey: '', confirm: '' })
        this.props.navigation.navigate('Unlock')
      }
    })
  }

  render() {
    return (
      <>
        <TextInput
          secureTextEntry={true}
          placeholder="口令"
          value={this.state.masterKey}
          onChangeText={text => this.setState({ masterKey: text })}
        />
        <TextInput
          secureTextEntry={true}
          placeholder="口令确认"
          value={this.state.confirm}
          onChangeText={text => this.setState({ confirm: text })}
        />
        {
          this.state.error_msg.length > 0 &&
          <Text>{this.state.error_msg}</Text>
        }
        <Button
          title="设置"
          onPress={() => this.setMasterKey()}
        />
        <Text>{`说明：
1、口令用于在本设备上加密/解密账户的种子。
2、账户的种子是账户的唯一凭证，不可泄漏、灭失，应做好备份。
3、本地存储的聊天和公告，未进行加密，如需销毁，请删除应用或相关数据。`}</Text>
      </>
    )
  }
}

const ReduxMasterKeyScreen = connect((state) => {
  return {
    master: state.master
  }
})(MasterKeyScreen)

export default ReduxMasterKeyScreen