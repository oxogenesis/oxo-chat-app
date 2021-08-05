import * as React from 'react';
import { View, Text, TextInput, Button } from 'react-native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { MasterKeyDerive } from '../../lib/OXO'

//Unlock界面
class UnlockScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { master_key: '', error_msg: '' }
  }

  unlock() {
    MasterKeyDerive(this.state.master_key)
      .then(result => {
        if (result) {
          this.props.dispatch({
            type: actionType.master.setMasterKey,
            master_key: this.state.master_key
          })
          this.setState({ master_key: '' })
          this.props.navigation.navigate('AvatarList')
        } else {
          this.setState({ master_key: '', error_msg: 'invalid MasterKey...' })
        }
      })
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.props.master.get('MasterKey') != null) {
        this.props.navigation.navigate('AvatarList')
      }
      this.setState({ error_msg: '' })
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <>
        <TextInput
          secureTextEntry={true}
          placeholder="MasterKey"
          value={this.state.master_key}
          onChangeText={text => this.setState({ master_key: text })}
        />
        {
          this.state.error_msg.length > 0 &&
          <Text>{this.state.error_msg}</Text>
        }
        <Button title="Unlock" onPress={() => this.unlock()} />
      </>
    )
  }
}

const ReduxUnlockScreen = connect((state) => {
  return {
    master: state.master
  }
})(UnlockScreen)

export default ReduxUnlockScreen