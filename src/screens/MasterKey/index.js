import * as React from 'react'
import { Text, Button, TextInput } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        <Text>{'Set MasterKey'}</Text>
        <TextInput
          secureTextEntry={true}
          placeholder="MasterKey"
          value={this.state.masterKey}
          onChangeText={text => this.setState({ masterKey: text })}
        />
        <TextInput
          secureTextEntry={true}
          placeholder="confirm MasterKey"
          value={this.state.confirm}
          onChangeText={text => this.setState({ confirm: text })}
        />
        {
          this.state.error_msg.length > 0 &&
          <Text>{this.state.error_msg}</Text>
        }
        <Button
          title="Set"
          onPress={() => this.setMasterKey()}
        />
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