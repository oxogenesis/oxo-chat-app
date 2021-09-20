import * as React from 'react'
import { Text, TextInput, Button } from 'react-native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'

import { ParseQrcode } from '../../lib/OXO'
//登录界面
class AddressAddFromQrcodeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { qrcode: '', address: '', relay: '', error_msg: 'invalid qrcode...' }
  }

  parseQrcode(text) {
    this.setState({ qrcode: text })
    let result = ParseQrcode(this.state.qrcode)
    console.log(result)
    if (result != false) {
      this.setState({ address: result.Address, relay: result.Relay, error_msg: '' })
    } else {
      this.setState({ address: '', relay: '', error_msg: 'invalid qrcode...' })
    }
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params && this.props.route.params.qrcode) {
        this.setState({ qrcode: this.props.route.params.qrcode })
      } else {
        this.setState({ qrcode: this.props.avatar.get('Qrcode') })
        console.log(this.state.qrcode)
      }
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <>
        <TextInput
          multiline={true}
          value={this.state.qrcode}
          onChangeText={text => this.parseQrcode(text)}
        />
        {
          this.state.error_msg.length > 0 ?
            <Text>{this.state.error_msg}</Text>
            :
            <>
              <TextInput
                value={this.state.address}
              />
              <TextInput
                value={this.state.relay}
              />
              <Button
                title="标记地址"
                onPress={() => this.props.navigation.navigate('AddressAdd', { address: this.state.address })} />
            </>
        }
      </>
    )
  }
}

const ReduxAddressAddFromQrcodeScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressAddFromQrcodeScreen)

export default ReduxAddressAddFromQrcodeScreen